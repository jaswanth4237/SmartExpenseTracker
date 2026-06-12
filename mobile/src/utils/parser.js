/**
 * Receipt Parsing Engine
 * Uses heuristics and regex to extract structured data from raw OCR text.
 */

export const parseReceipt = (rawText) => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const result = {
    merchant: '',
    purchase_date: '',
    total: 0,
    tax: 0,
    line_items: [],
    confidence: {
      merchant: 'high',
      purchase_date: 'high',
      total: 'high',
      tax: 'high',
      line_items: 'high'
    }
  };

  if (lines.length === 0) return result;

  // 1. Merchant Name Heuristic: Often the first line
  result.merchant = lines[0];

  // 2. Date Parsing
  const dateRegex = /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/;
  const dateResult = rawText.match(dateRegex);
  if (dateResult) {
    let [_, d1, d2, year] = dateResult;
    if (year.length === 2) year = '20' + year;
    // Assuming MM/DD/YYYY for US receipts as per FAQ
    result.purchase_date = `${year}-${d1.padStart(2, '0')}-${d2.padStart(2, '0')}`;
  } else {
    result.purchase_date = new Date().toISOString().split('T')[0];
    result.confidence.purchase_date = 'low';
  }

  // 3. Currency/Price Regex
  const priceRegex = /([0-9]+\.[0-9]{2})/;

  // 4. Extracting Totals and Line Items
  let foundTotal = false;
  let foundTax = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].toUpperCase();
    const priceMatch = line.match(priceRegex);

    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      
      if (line.includes('TOTAL') || line.includes('BAL') || line.includes('AMOUNT DUE')) {
        if (price > result.total) { // Heuristic: Max value with Total keyword
          result.total = price;
          foundTotal = true;
        }
      } else if (line.includes('TAX')) {
        result.tax = price;
        foundTax = true;
      } else {
        // Potential line item
        // Clean description: Remove the price from the line
        const description = line.replace(priceRegex, '').replace(/[^A-Z0-9\s]/g, '').trim();
        if (description.length > 2) {
          result.line_items.push({ description, price });
        }
      }
    }
  }

  // Validation Heuristics for Confidence
  const itemSum = result.line_items.reduce((sum, item) => sum + item.price, 0);
  
  if (!foundTotal) {
    // If no total found with keywords, use the max price found or sum
    result.total = Math.max(itemSum + result.tax, result.total);
    result.confidence.total = 'low';
  }

  if (result.total > 0 && Math.abs((itemSum + result.tax) - result.total) > 0.05) {
    result.confidence.line_items = 'low';
    // Sometimes subtotal is misread as total
    if (itemSum > result.total) {
        result.confidence.total = 'low';
    }
  }

  if (!result.merchant || result.merchant.length < 3) {
      result.confidence.merchant = 'low';
  }

  return result;
};

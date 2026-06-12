import { parseReceipt } from '../mobile/src/utils/parser';

const FIXTURES = {
    mcdonalds: `
MCDONALD'S
STORE #1234
03/15/2024 12:45 PM
CHEESEBURGER 1.99
HAPPY MEAL 4.50
SUBTOTAL 6.49
TAX 0.54
TOTAL 7.03
CASH 10.00
CHANGE 2.97
`,
    walmart: `
WALMART SUPERCENTER
123 MAIN ST, BENTONVILLE, AR
DATE: 06/10/2026
MILK 3.50
EGGS 2.99
BREAD 1.50
TAX 0.00
TOTAL 7.99
`,
    starbucks: `
STARBUCKS COFFEE
LATTE 4.75
MUFFIN 3.25
TAX 0.64
TOTAL 8.64
THANK YOU
`,
    shell: `
SHELL GAS STATION
06/11/2026
UNLEADED FUEL 45.00
TOTAL 45.00
`,
    restaurant: `
ITALIAN BISTRO
PASTA 18.00
WINE 12.00
SUBTOTAL 30.00
TAX 2.40
TOTAL 32.40
TIP ____
`
};

describe('Receipt Parsing Engine', () => {
    test('Parses McDonald\'s receipt correctly', () => {
        const result = parseReceipt(FIXTURES.mcdonalds);
        expect(result.merchant).toBe("MCDONALD'S");
        expect(result.purchase_date).toBe('2024-03-15');
        expect(result.total).toBe(7.03);
        expect(result.tax).toBe(0.54);
        expect(result.line_items).toContainEqual({ description: 'CHEESEBURGER', price: 1.99 });
    });

    test('Parses Walmart receipt correctly', () => {
        const result = parseReceipt(FIXTURES.walmart);
        expect(result.merchant).toBe("WALMART SUPERCENTER");
        expect(result.total).toBe(7.99);
        expect(result.line_items.length).toBe(3);
    });

    test('Parses Starbucks receipt correctly', () => {
        const result = parseReceipt(FIXTURES.starbucks);
        expect(result.merchant).toBe("STARBUCKS COFFEE");
        expect(result.total).toBe(8.64);
    });

    test('Handles low confidence when no total keyword is found', () => {
        const brokenReceipt = "UNKNOWN STORE\nITEM 1.99\nNO KEYWORD 1.99";
        const result = parseReceipt(brokenReceipt);
        expect(result.confidence.total).toBe('low');
    });

    test('Parses Shell gas station receipt', () => {
        const result = parseReceipt(FIXTURES.shell);
        expect(result.merchant).toBe("SHELL GAS STATION");
        expect(result.total).toBe(45.00);
    });

    test('Parses Restaurant receipt with subtotal and tax', () => {
        const result = parseReceipt(FIXTURES.restaurant);
        expect(result.total).toBe(32.40);
        expect(result.tax).toBe(2.40);
    });
});

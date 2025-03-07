import * as math from '../src/math';
import * as stubs from '../src/stubs';
import * as fs from 'fs';
import { exportComparisonCSV } from '../src/export-csv';

jest.mock('fs', () => ({
    writeFileSync: jest.fn(),
}));

describe('Integration Tests with Stubs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('Basic Function Integration', () => {
        test('factorial should match the stub', () => {
            for (let n = 0; n <= 5; n++) {
                const actualValue = math.factorial(n);
                const stubValue = stubs.factorialStub(n);
                
                expect(stubValue).toBeCloseTo(actualValue, 0);
            }
        });
        
        test('sin and cos should match the stubs', () => {
            const testPoints = [0, Math.PI/6, Math.PI/4, Math.PI/3, Math.PI/2, Math.PI];
            
            for (const x of testPoints) {
                const actualSin = math.taylorSin(x, 15);
                const stubSin = stubs.sinStub(x);
                
                const actualCos = math.taylorCos(x, 15);
                const stubCos = stubs.cosStub(x);
                
                expect(stubSin).toBeCloseTo(actualSin, 1);
                expect(stubCos).toBeCloseTo(actualCos, 1);
            }
        });
    });
    
    describe('Trigonometric Part Integration', () => {
        test('trigFunction should integrate with stubs', () => {
            const cscSpy = jest.spyOn(stubs, 'cscStub');
            const secSpy = jest.spyOn(stubs, 'secStub');
            const cosSpy = jest.spyOn(stubs, 'cosStub');
            
            const x = -0.5;
            const result = stubs.trigFunctionStub(x);
            
            expect(cscSpy).toHaveBeenCalledWith(x);
            expect(secSpy).toHaveBeenCalledWith(x);
            expect(cosSpy).toHaveBeenCalledWith(x);
            
            // Check that the result is defined
            expect(isNaN(result)).toBe(false);
            
            // Restore original functions
            cscSpy.mockRestore();
            secSpy.mockRestore();
            cosSpy.mockRestore();
        });
        
        test('trigFunction should handle special cases', () => {
            // At x = 0, sin(0) = 0, so csc(0) should be NaN
            const result = stubs.trigFunctionStub(0);
            expect(isNaN(result)).toBe(true);
        });
    });
    
    describe('Logarithmic Part Integration', () => {
        test('logFunction should integrate with stubs', () => {
            const log5Spy = jest.spyOn(stubs, 'log5Stub');
            const log3Spy = jest.spyOn(stubs, 'log3Stub');
            const log10Spy = jest.spyOn(stubs, 'log10Stub');
            const lnSpy = jest.spyOn(stubs, 'lnStub');
            
            // Call the log function stub
            const x = 2;
            const result = stubs.logFunctionStub(x);
            
            // Check that components were called
            expect(log5Spy).toHaveBeenCalledWith(x);
            expect(log3Spy).toHaveBeenCalledWith(x);
            expect(log10Spy).toHaveBeenCalledWith(x);
            expect(lnSpy).toHaveBeenCalledWith(x);
            
            // Check that the result is defined
            expect(isNaN(result)).toBe(false);
            
            // Restore original functions
            log5Spy.mockRestore();
            log3Spy.mockRestore();
            log10Spy.mockRestore();
            lnSpy.mockRestore();
        });
        
        test('logFunction should handle special cases', () => {
            // At x = 0, logarithms are undefined
            const result = stubs.logFunctionStub(0);
            expect(isNaN(result)).toBe(true);
        });
    });
    
    // System function integration
    describe('System Function Integration', () => {
        test('systemFunction should use trigFunction for x ≤ 0', () => {
            // Create spy for trigFunctionStub
            const trigSpy = jest.spyOn(stubs, 'trigFunctionStub');
            
            // Call system function with x ≤ 0
            const x = -0.5;
            stubs.systemFunctionStub(x);
            
            // Check that trig function was called
            expect(trigSpy).toHaveBeenCalledWith(x);
            
            // Restore original function
            trigSpy.mockRestore();
        });
        
        test('systemFunction should use logFunction for x > 0', () => {
            // Create spy for logFunctionStub
            const logSpy = jest.spyOn(stubs, 'logFunctionStub');
            
            // Call system function with x > 0
            const x = 2;
            stubs.systemFunctionStub(x);
            
            // Check that log function was called
            expect(logSpy).toHaveBeenCalledWith(x);
            
            // Restore original function
            logSpy.mockRestore();
        });
    });
    
    // CSV export tests
    describe('CSV Export Tests', () => {
        test('Should export trigonometric part comparison', () => {
            // Real trig function implementation
            const realTrigFunction = (x: number) => {
                return (math.taylorCsc(x, 15) - math.taylorSec(x, 15)) - math.taylorCos(x, 15);
            };
            
            // Export comparison to CSV
            exportComparisonCSV(
                'trig_comparison.csv',
                -1.5,
                -0.1,
                0.1,
                realTrigFunction,
                stubs.trigFunctionStub
            );
            
            // Check that writeFileSync was called
            expect(fs.writeFileSync).toHaveBeenCalled();
        });
        
        test('Should export logarithmic part comparison', () => {
            // Real log function implementation
            const realLogFunction = (x: number) => {
                if (x <= 0) return NaN;
                
                const log5x = math.taylorLn(x, 15) / math.taylorLn(5, 15);
                const log3x = math.taylorLn(x, 15) / math.taylorLn(3, 15);
                const log10x = math.taylorLog(x, 15);
                const lnx = math.taylorLn(x, 15);
                
                const numerator = Math.pow(log5x - lnx, 4) * Math.pow(log5x + log3x, 3);
                const denominator = log10x * lnx;
                
                if (denominator === 0 || !isFinite(denominator)) {
                    return NaN;
                }
                
                return numerator / denominator;
            };
            
            // Export comparison to CSV
            exportComparisonCSV(
                'log_comparison.csv',
                0.1,
                5,
                0.1,
                realLogFunction,
                stubs.logFunctionStub
            );
            
            // Check that writeFileSync was called
            expect(fs.writeFileSync).toHaveBeenCalled();
        });
    });
});

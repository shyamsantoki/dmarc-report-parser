"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const parseDmarcReportFromEmail_1 = require("./parseDmarcReportFromEmail");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('parseDMARCReport', () => {
    (0, vitest_1.it)('should parse a DMARC report from a raw email with a gzip attachment', async () => {
        const testRawEmail = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./test/fixtures/email/email-source-with-gz.txt"), "utf-8");
        const result = await (0, parseDmarcReportFromEmail_1.parseDmarcReportFromEmail)(testRawEmail);
        (0, vitest_1.expect)(result).toHaveProperty('totalReports');
        (0, vitest_1.expect)(result).toHaveProperty('totalFailures');
        (0, vitest_1.expect)(result).toHaveProperty('failures');
        (0, vitest_1.expect)(result.totalReports).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should parse a DMARC report from a raw email with a zip attachment', async () => {
        const testRawEmail = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./test/fixtures/email/email-source-with-zip.txt"), "utf-8");
        const result = await (0, parseDmarcReportFromEmail_1.parseDmarcReportFromEmail)(testRawEmail);
        (0, vitest_1.expect)(result).toHaveProperty('totalReports');
        (0, vitest_1.expect)(result).toHaveProperty('totalFailures');
        (0, vitest_1.expect)(result).toHaveProperty('failures');
        (0, vitest_1.expect)(result.totalReports).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should return an empty result for an email without a DMARC report', async () => {
        const emptyEmail = 'Subject: Test Email\r\n\r\nThis is a test email without a DMARC report.';
        await (0, vitest_1.expect)((0, parseDmarcReportFromEmail_1.parseDmarcReportFromEmail)(emptyEmail)).rejects.toThrowError();
    });
    (0, vitest_1.it)('should throw an error for an invalid email input', async () => {
        const invalidEmail = 'This is not a valid email';
        await (0, vitest_1.expect)((0, parseDmarcReportFromEmail_1.parseDmarcReportFromEmail)(invalidEmail)).rejects.toThrowError();
    });
});

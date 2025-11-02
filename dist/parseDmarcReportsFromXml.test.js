"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const parseDmarcReportsFromXml_1 = require("./parseDmarcReportsFromXml");
const vitest_1 = require("vitest");
(0, vitest_1.describe)("parseDmarcReportsFromXml", () => {
    const validXml = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./test/fixtures/xml/report-valid.xml"), "utf-8");
    const quarantineXml = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./test/fixtures/xml/report-quarantine.xml"), "utf-8");
    const rejectXml = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./test/fixtures/xml/report-reject.xml"), "utf-8");
    const dkimFailXml = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./test/fixtures/xml/report-dkim-fail.xml"), "utf-8");
    const spfFailXml = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./test/fixtures/xml/report-spf-fail.xml"), "utf-8");
    const invalidXml = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "./test/fixtures/xml/report-invalid.xml"), "utf-8");
    (0, vitest_1.it)("should parse a single valid DMARC report", async () => {
        const result = await (0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)([validXml]);
        (0, vitest_1.expect)(result.totalReports).toBe(1);
        (0, vitest_1.expect)(result.reports.length).toBe(1);
        (0, vitest_1.expect)(result).toMatchSnapshot();
    });
    (0, vitest_1.it)("should parse multiple valid DMARC reports", async () => {
        const result = await (0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)([validXml, validXml]);
        (0, vitest_1.expect)(result.totalReports).toBe(2);
        (0, vitest_1.expect)(result.reports.length).toBe(2);
    });
    (0, vitest_1.it)("should parse a DMARC report with a quarantine disposition", async () => {
        const result = await (0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)([quarantineXml]);
        (0, vitest_1.expect)(result.totalReports).toBe(1);
        (0, vitest_1.expect)(result.reports.length).toBe(1);
        (0, vitest_1.expect)(result.failures).toHaveLength(1);
        (0, vitest_1.expect)(result).toMatchSnapshot();
    });
    (0, vitest_1.it)("should parse a DMARC report with a reject disposition", async () => {
        const result = await (0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)([rejectXml]);
        (0, vitest_1.expect)(result.totalReports).toBe(1);
        (0, vitest_1.expect)(result.reports.length).toBe(1);
        (0, vitest_1.expect)(result.failures).toHaveLength(1);
        (0, vitest_1.expect)(result).toMatchSnapshot();
    });
    (0, vitest_1.it)("should parse a DMARC report that is passing but has a DKIM failure", async () => {
        const result = await (0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)([dkimFailXml]);
        (0, vitest_1.expect)(result.totalReports).toBe(1);
        (0, vitest_1.expect)(result.reports.length).toBe(1);
        (0, vitest_1.expect)(result.failures).toHaveLength(0);
        (0, vitest_1.expect)(result.dkimFailures).toHaveLength(1);
        (0, vitest_1.expect)(result).toMatchSnapshot();
    });
    (0, vitest_1.it)("should parse a DMARC report with a SPF failure", async () => {
        const result = await (0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)([spfFailXml]);
        (0, vitest_1.expect)(result.totalReports).toBe(1);
        (0, vitest_1.expect)(result.reports.length).toBe(1);
        (0, vitest_1.expect)(result.failures).toHaveLength(0);
        (0, vitest_1.expect)(result.spfFailures).toHaveLength(1);
        (0, vitest_1.expect)(result).toMatchSnapshot();
    });
    (0, vitest_1.it)("should throw an error when parsing an invalid DMARC report", async () => {
        await (0, vitest_1.expect)((0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)([invalidXml])).rejects.toThrow();
    });
    (0, vitest_1.it)("should throw an error when parsing multiple reports of which some are invalid", async () => {
        await (0, vitest_1.expect)((0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)([validXml, invalidXml])).rejects.toThrow();
    });
});

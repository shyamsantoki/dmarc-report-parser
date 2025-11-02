"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDmarcReportsFromXml = void 0;
const xml2js_1 = require("xml2js");
const dmarc_feedback_schema_1 = require("./dmarc-feedback-schema");
/**
 * Parses DMARC reports from an array of XML strings or Buffers
 * @throws Error if the XML is not valid or does not match the DMARC schema
 */
async function parseDmarcReportsFromXml(xmlFiles) {
    const dmarcReports = (await Promise.all(xmlFiles.map((xml) => (0, xml2js_1.parseStringPromise)(xml)))).map((result) => dmarc_feedback_schema_1.DmarcFeedbackSchema.parse(result.feedback));
    // Analyze the DMARC reports and identify any failures
    const failures = dmarcReports.flatMap(({ record }) => {
        return record.filter((r) => {
            return r.row.policyEvaluated.disposition !== "none";
        });
    });
    const dkimFailures = dmarcReports.flatMap(({ record }) => {
        return record.filter((r) => {
            return r.row.policyEvaluated.dkim === "fail";
        });
    });
    const spfFailures = dmarcReports.flatMap(({ record }) => {
        return record.filter((r) => {
            return r.row.policyEvaluated.spf === "fail";
        });
    });
    return {
        totalReports: dmarcReports.length,
        totalFailures: failures.length,
        failures,
        dkimFailures,
        spfFailures,
        reports: dmarcReports,
    };
}
exports.parseDmarcReportsFromXml = parseDmarcReportsFromXml;

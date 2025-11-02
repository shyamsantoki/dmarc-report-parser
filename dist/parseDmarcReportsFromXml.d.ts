/// <reference types="node" />
import { DmarcFeedback, DmarcFeedbackRecord } from "./dmarc-feedback-schema";
/**
 * The results of parsing DMARC reports
 */
export type DmarcReportResults = {
    /**
     * The total number of reports parsed
     */
    totalReports: number;
    /**
     * The total number of reports that failed DMARC
     */
    totalFailures: number;
    /**
     * The reports that failed DMARC
     */
    failures: DmarcFeedbackRecord[];
    /**
     * The reports that failed DMARC due to DKIM
     */
    dkimFailures: DmarcFeedbackRecord[];
    /**
     * The reports that failed DMARC due to SPF
     */
    spfFailures: DmarcFeedbackRecord[];
    /**
     * The parsed DMARC reports
     */
    reports: DmarcFeedback[];
};
/**
 * Parses DMARC reports from an array of XML strings or Buffers
 * @throws Error if the XML is not valid or does not match the DMARC schema
 */
export declare function parseDmarcReportsFromXml(xmlFiles: (string | Buffer)[]): Promise<DmarcReportResults>;

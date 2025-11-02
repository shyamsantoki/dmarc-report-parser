import { DmarcReportResults } from "./parseDmarcReportsFromXml";
/**
 * Parses a DMARC report from a raw email message
 * The DMARC report can be contained in a .zip, .gz or .xml attachment
 * @throws Error if the email does not contain a DMARC report
 * @param rawEmail The raw email message
 */
export declare function parseDmarcReportFromEmail(rawEmail: string): Promise<DmarcReportResults>;

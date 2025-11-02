"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDmarcReportFromEmail = void 0;
const mailparser_1 = require("mailparser");
const jszip_1 = __importDefault(require("jszip"));
const zlib_1 = require("zlib");
const parseDmarcReportsFromXml_1 = require("./parseDmarcReportsFromXml");
/**
 * Parses a DMARC report from a raw email message
 * The DMARC report can be contained in a .zip, .gz or .xml attachment
 * @throws Error if the email does not contain a DMARC report
 * @param rawEmail The raw email message
 */
async function parseDmarcReportFromEmail(rawEmail) {
    // Parse the raw email to extract attachments
    const parsedEmail = await (0, mailparser_1.simpleParser)(rawEmail);
    // Filter the attachments to only include .zip and .gz files
    const attachments = parsedEmail.attachments.filter((attachment) => {
        if (attachment.filename) {
            const ext = attachment.filename.split(".").pop();
            return ext && ["zip", "gz", "xml"].includes(ext);
        }
        return false;
    });
    // Process the compressed attachments and extract their contents
    const extractedContents = (await Promise.all(attachments.map(async (attachment) => {
        var _a, _b, _c;
        if ((_a = attachment.filename) === null || _a === void 0 ? void 0 : _a.endsWith(".zip")) {
            const zip = new jszip_1.default();
            const contents = await zip.loadAsync(attachment.content);
            return Promise.all(Object.values(contents.files).map((file) => file.async("text")));
        }
        else if ((_b = attachment.filename) === null || _b === void 0 ? void 0 : _b.endsWith(".gz")) {
            return new Promise((resolve, reject) => {
                (0, zlib_1.gunzip)(attachment.content, (err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve([data.toString()]);
                });
            });
        }
        else if ((_c = attachment.filename) === null || _c === void 0 ? void 0 : _c.endsWith(".xml")) {
            return [attachment.content];
        }
        return [];
    }))).flat();
    // Search for xml files within the extracted contents
    const xmlFiles = extractedContents
        .flat()
        .filter((content) => typeof content === "string" && content.startsWith("<?xml"));
    if (xmlFiles.length === 0) {
        throw new Error("No DMARC reports found in email");
    }
    return await (0, parseDmarcReportsFromXml_1.parseDmarcReportsFromXml)(xmlFiles);
}
exports.parseDmarcReportFromEmail = parseDmarcReportFromEmail;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmarcFeedbackSchema = void 0;
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const zod_1 = require("zod");
const zodToCamelCase = (zod) => zod.transform((val) => (0, camelcase_keys_1.default)(val));
// Shared function for refining and transforming arrays with maxOccurs = 1
const singleItem = (schema) => {
    return schema
        .array()
        .refine((data) => data.length === 1, {
        message: "Must be an array of length 1",
    })
        .transform(([singleItem]) => singleItem);
};
const DateRangeType = zodToCamelCase(zod_1.z.object({
    begin: singleItem(zod_1.z.coerce.number().int()),
    end: singleItem(zod_1.z.coerce.number().int()),
}));
const ReportMetadataType = zodToCamelCase(zod_1.z.object({
    org_name: singleItem(zod_1.z.string()),
    email: singleItem(zod_1.z.string()),
    extra_contact_info: singleItem(zod_1.z.string()).optional(),
    report_id: singleItem(zod_1.z.string()),
    date_range: singleItem(DateRangeType),
    error: zod_1.z.array(zod_1.z.string()).optional(),
}));
const AlignmentType = zod_1.z.enum(["r", "s"]);
const DispositionType = zod_1.z.enum(["none", "quarantine", "reject"]);
const PolicyPublishedType = zodToCamelCase(zod_1.z.object({
    domain: singleItem(zod_1.z.string()),
    p: singleItem(DispositionType),
    sp: singleItem(DispositionType).optional(),
    adkim: singleItem(AlignmentType).optional(),
    aspf: singleItem(AlignmentType).optional(),
    pct: singleItem(zod_1.z.coerce.number().int()).optional(),
    fo: singleItem(zod_1.z.string()).optional(),
}));
const DMARCResultType = zod_1.z.enum(["pass", "fail"]);
const PolicyOverrideType = zod_1.z.enum([
    "forwarded",
    "sampled_out",
    "trusted_forwarder",
    "mailing_list",
    "local_policy",
    "other",
]);
// allow multiple <type> values under <reason>
const PolicyOverrideReason = zodToCamelCase(zod_1.z.object({
    type: zod_1.z.union([
        PolicyOverrideType,
        zod_1.z.array(zod_1.z.string()).transform((arr) => arr[0]), // take first element if array
    ]),
    comment: zod_1.z.string().optional(),
}));
const PolicyEvaluatedType = zodToCamelCase(zod_1.z.object({
    disposition: singleItem(DispositionType),
    dkim: singleItem(DMARCResultType),
    spf: singleItem(DMARCResultType),
    reason: zod_1.z.array(PolicyOverrideReason).optional(),
}));
const IPAddress = zod_1.z.string().ip();
const RowType = zodToCamelCase(zod_1.z.object({
    source_ip: singleItem(IPAddress),
    count: singleItem(zod_1.z.coerce.number().int()),
    policy_evaluated: singleItem(PolicyEvaluatedType),
}));
const IdentifierType = zodToCamelCase(zod_1.z.object({
    envelope_to: singleItem(zod_1.z.string()).optional(),
    envelope_from: singleItem(zod_1.z.string()).optional(),
    header_from: singleItem(zod_1.z.string()),
}));
// lowercase normalization for result fields
const DKIMResultType = zod_1.z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), zod_1.z.enum([
    "none",
    "pass",
    "fail",
    "policy",
    "neutral",
    "temperror",
    "permerror",
]));
const DKIMAuthResultType = zodToCamelCase(zod_1.z.object({
    domain: singleItem(zod_1.z.string()),
    selector: singleItem(zod_1.z.string()).optional(),
    result: singleItem(DKIMResultType),
    human_result: singleItem(zod_1.z.string()).optional(),
}));
const SPFDomainScope = zod_1.z.enum(["helo", "mfrom"]);
// ✅ FIX #2 — lowercase normalization for SPF results too
const SPFResultType = zod_1.z.preprocess((val) => (typeof val === "string" ? val.toLowerCase() : val), zod_1.z.enum([
    "none",
    "neutral",
    "pass",
    "fail",
    "softfail",
    "temperror",
    "permerror",
]));
const SPFAuthResultType = zodToCamelCase(zod_1.z.object({
    domain: singleItem(zod_1.z.string()),
    scope: singleItem(SPFDomainScope).optional(),
    result: singleItem(SPFResultType),
}));
const AuthResultType = zodToCamelCase(zod_1.z.object({
    dkim: zod_1.z.array(DKIMAuthResultType).optional(),
    spf: zod_1.z.array(SPFAuthResultType),
}));
const RecordType = zodToCamelCase(zod_1.z.object({
    row: singleItem(RowType),
    identifiers: singleItem(IdentifierType),
    auth_results: singleItem(AuthResultType),
}));
exports.DmarcFeedbackSchema = zodToCamelCase(zod_1.z.object({
    version: singleItem(zod_1.z.coerce.number()).optional(),
    report_metadata: singleItem(ReportMetadataType).optional(),
    policy_published: singleItem(PolicyPublishedType),
    record: zod_1.z.array(RecordType),
}));

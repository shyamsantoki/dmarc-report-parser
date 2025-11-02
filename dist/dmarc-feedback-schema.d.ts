import { ZodEffects, z } from "zod";
declare const RecordType: ZodEffects<z.ZodTypeAny, {
    row: {
        sourceIp: string;
        count: number;
        policyEvaluated: {
            disposition: "none" | "quarantine" | "reject";
            dkim: "pass" | "fail";
            spf: "pass" | "fail";
            reason?: {
                type: string;
                comment?: string | undefined;
            }[] | undefined;
        };
    };
    identifiers: {
        headerFrom: string;
        envelopeTo?: string | undefined;
        envelopeFrom?: string | undefined;
    };
    authResults: {
        spf: {
            domain: string;
            result: "none" | "pass" | "fail" | "neutral" | "temperror" | "permerror" | "softfail";
            scope?: "helo" | "mfrom" | undefined;
        }[];
        dkim?: {
            domain: string;
            result: "none" | "pass" | "fail" | "policy" | "neutral" | "temperror" | "permerror";
            selector?: string | undefined;
            humanResult?: string | undefined;
        }[] | undefined;
    };
}, any>;
export declare const DmarcFeedbackSchema: ZodEffects<z.ZodTypeAny, {
    policyPublished: {
        domain: string;
        p: "none" | "quarantine" | "reject";
        sp?: "none" | "quarantine" | "reject" | undefined;
        adkim?: "r" | "s" | undefined;
        aspf?: "r" | "s" | undefined;
        pct?: number | undefined;
        fo?: string | undefined;
    };
    record: {
        row: {
            sourceIp: string;
            count: number;
            policyEvaluated: {
                disposition: "none" | "quarantine" | "reject";
                dkim: "pass" | "fail";
                spf: "pass" | "fail";
                reason?: {
                    type: string;
                    comment?: string | undefined;
                }[] | undefined;
            };
        };
        identifiers: {
            headerFrom: string;
            envelopeTo?: string | undefined;
            envelopeFrom?: string | undefined;
        };
        authResults: {
            spf: {
                domain: string;
                result: "none" | "pass" | "fail" | "neutral" | "temperror" | "permerror" | "softfail";
                scope?: "helo" | "mfrom" | undefined;
            }[];
            dkim?: {
                domain: string;
                result: "none" | "pass" | "fail" | "policy" | "neutral" | "temperror" | "permerror";
                selector?: string | undefined;
                humanResult?: string | undefined;
            }[] | undefined;
        };
    }[];
    version?: number | undefined;
    reportMetadata?: {
        orgName: string;
        email: string;
        reportId: string;
        dateRange: {
            begin: number;
            end: number;
        };
        extraContactInfo?: string | undefined;
        error?: string[] | undefined;
    } | undefined;
}, any>;
export type DmarcFeedback = z.infer<typeof DmarcFeedbackSchema>;
export type DmarcFeedbackRecord = z.infer<typeof RecordType>;
export {};

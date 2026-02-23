import { NextRequest, NextResponse } from "next/server";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import * as fs from "fs";
import * as path from "path";

export async function POST(req: NextRequest) {
    try {
        const candidateData = await req.json();

        if (!candidateData || !candidateData.name) {
            return NextResponse.json(
                { success: false, message: "Missing candidate data" },
                { status: 400 }
            );
        }

        // Load template
        const templatePath = path.join(process.cwd(), "templates", "offer_template.docx");

        if (!fs.existsSync(templatePath)) {
            return NextResponse.json(
                { success: false, message: "Offer template not found. Place offer_template.docx in /templates/" },
                { status: 500 }
            );
        }

        const templateContent = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(templateContent);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: { start: "{{", end: "}}" },
        });

        // Get current date formatted
        const now = new Date();
        const currentDate = now.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        // Build the data map matching the template placeholders
        const data: Record<string, string> = {
            // Standard placeholders
            "Candidate Name": candidateData.name || "",
            "CANDIDATE_NAME": candidateData.name || "",
            "Job Title": candidateData.position || "",
            "JOB_TITLE": candidateData.position || "",
            "Joining Date": candidateData.start_date || "",
            "JOINING_DATE": candidateData.start_date || "",
            "Probation Monthly Salary": candidateData.salary || "",
            "MONTHLY_SALARY": candidateData.salary || "",
            "Probation Period Months": candidateData.probation_period || "3",
            "Probation period": candidateData.probation_period || "3",
            "Current Date": currentDate,
            "CURRENT_DATE": currentDate,
            "Interview Date": candidateData.test_date || currentDate,
            "INTERVIEW_DATE": candidateData.test_date || currentDate,
            "Acceptance Date": "",
            "Offer Validity Days": "7",
            "OFFER_EXPIRY_DAYS": "7",
            "ongoing_salary": candidateData.ongoing_salary || candidateData.salary || "",
            "ONGOING_SALARY": candidateData.ongoing_salary || candidateData.salary || "",
            "company": candidateData.company || "StructCrew",
            "COMPANY": candidateData.company || "StructCrew",
        };

        doc.render(data);

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });

        const nameClean = candidateData.name.replace(/\s+/g, "_");
        const filename = `offer_letter_${nameClean}.docx`;

        return new NextResponse(new Uint8Array(buf), {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("DOCX Generation Error:", message);
        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}

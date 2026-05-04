export type ParagraphBlock = { readonly type: "p"; readonly text: string };
export type UlBlock = { readonly type: "ul"; readonly items: readonly string[] };
export type OlBlock = { readonly type: "ol"; readonly items: readonly string[] };
export type DlBlock = {
  readonly type: "dl";
  readonly items: readonly { readonly term: string; readonly definition: string }[];
};
export type SubsectionBlock = {
  readonly type: "sub";
  readonly id: string;
  readonly heading: string;
  readonly blocks: readonly ContentBlock[];
};
export type ContentBlock = ParagraphBlock | UlBlock | OlBlock | DlBlock | SubsectionBlock;

export type PolicySection = {
  readonly id: string;
  readonly heading: string;
  readonly blocks: readonly ContentBlock[];
};

export interface PrivacyPolicyContent {
  readonly title: string;
  readonly preamble: readonly string[];
  readonly dpaTitle: string;
  readonly lastUpdated: string;
  readonly dpaIntro: string;
  readonly sections: readonly PolicySection[];
  readonly contactEmail: string;
  readonly addresses: readonly string[];
}

export const privacyPolicy: PrivacyPolicyContent = {
  title: "Our Commitment to Recruitment Excellence & Data Protection",

  preamble: [
    "At W3 Sourcing, we operate to the highest professional and ethical standards in recruitment, built on trust, discretion, and long-term partnerships. We work with senior candidates and organisations across competitive and regulated markets, and we recognise that confidentiality, fairness, and integrity are fundamental to responsible recruitment.",
    "We are committed to safeguarding all client and candidate information entrusted to us. Personal data is handled with care, processed only for legitimate recruitment purposes, and protected through robust organisational, technical, and contractual controls. Access to information is strictly limited to authorised personnel, and we do not sell, misuse, or publicly disclose confidential data.",
    "Equally, we are committed to ethical recruitment practices that promote fair opportunity and non-discrimination. We support inclusive hiring and assess candidates based on role-relevant skills, experience, and merit. We do not tolerate discrimination or unfair treatment on the basis of race, ethnicity, gender, sexual orientation, age, disability, religion, nationality, or any other protected characteristic, and we expect the same standards from the partners we work with.",
    "Our recruitment processes are human-led, transparent, and accountable, designed to treat candidates with respect at every stage. Technology is used only to support efficiency and accuracy and is deployed within private, business-controlled environments; it does not replace human judgment or enable automated hiring decisions.",
    "W3 Sourcing complies with applicable data protection, privacy, and employment-related laws across the jurisdictions in which we operate and regularly reviews its practices to ensure alignment with evolving regulatory standards and market expectations.",
    "Above all, we recognise the responsibility that comes with representing individuals and organisations at pivotal moments in their careers and growth. Acting ethically, protecting confidential information, and supporting fair access to opportunity are central to how we build trust and deliver long-term value.",
  ],

  dpaTitle: "Master Data Processing Addendum W3 Sourcing",
  lastUpdated: "2/6/2026",

  dpaIntro:
    'This Master Data Processing Addendum ("DPA") applies to Personal Data processed by W3 Sourcing in connection with recruitment and advisory services. It forms part of the agreement between W3 Sourcing and the Client (the "Agreement"). It also explains how W3 Sourcing processes Candidate Personal Data where W3 Sourcing acts as a Controller.',

  sections: [
    {
      id: "s1",
      heading: "1. Definitions",
      blocks: [
        {
          type: "dl",
          items: [
            {
              term: "Personal Data",
              definition: "information relating to an identified or identifiable individual.",
            },
            {
              term: "Candidate Personal Data",
              definition:
                "Personal Data relating to candidates, applicants, contractors, or prospective hires.",
            },
            {
              term: "Client Personal Data",
              definition:
                "Personal Data provided by or on behalf of the Client (e.g., hiring manager contact details, interview panels, employees providing references).",
            },
            {
              term: "Controller",
              definition: "the party that determines purposes/means of processing.",
            },
            {
              term: "Processor",
              definition: "the party that processes Personal Data on behalf of a Controller.",
            },
            {
              term: "Applicable Data Protection Laws",
              definition:
                "laws applicable to processing, including UK GDPR, EU GDPR, Singapore PDPA, Hong Kong PDPO, UAE PDPL, and relevant US state laws (including CPRA where applicable).",
            },
          ],
        },
      ],
    },

    {
      id: "s2",
      heading: "2. Roles: When W3 Sourcing Is Processor vs Controller",
      blocks: [
        {
          type: "sub",
          id: "s2-1",
          heading: "2.1 Processing as a Processor (Client Personal Data)",
          blocks: [
            {
              type: "p",
              text: "For Client Personal Data processed to deliver services to the Client, the Client is the Controller and W3 Sourcing is the Processor.",
            },
          ],
        },
        {
          type: "sub",
          id: "s2-2",
          heading: "2.2 Processing as an Independent Controller (Candidate Personal Data)",
          blocks: [
            {
              type: "p",
              text: "For Candidate Personal Data collected and maintained in W3 Sourcing's talent network and used to provide recruitment services across opportunities, W3 Sourcing typically acts as an independent Controller (and in some engagements may act as a joint controller with the Client for limited workflows). Where W3 Sourcing acts as Controller, Section 11 (Candidate Processing Terms) applies.",
            },
          ],
        },
        {
          type: "sub",
          id: "s2-3",
          heading: "2.3 Dual Role Clarity",
          blocks: [
            {
              type: "p",
              text: "The parties acknowledge that W3 Sourcing may process different data sets under different roles at the same time. This DPA allocates obligations by data set and purpose.",
            },
          ],
        },
      ],
    },

    {
      id: "s3",
      heading: "3. Processor Terms",
      blocks: [
        {
          type: "sub",
          id: "s3-1",
          heading: "3.1 Processing Instructions",
          blocks: [
            {
              type: "p",
              text: "W3 Sourcing shall process Client Personal Data only:",
            },
            {
              type: "ul",
              items: [
                "on documented instructions from the Client; and",
                "as necessary to perform the services under the Agreement.",
              ],
            },
            {
              type: "p",
              text: "W3 Sourcing shall not sell Client Personal Data or use it for advertising or unrelated purposes.",
            },
          ],
        },
        {
          type: "sub",
          id: "s3-2",
          heading: "3.2 Confidentiality",
          blocks: [
            {
              type: "p",
              text: "W3 Sourcing ensures personnel authorised to process Client Personal Data are bound by confidentiality obligations and trained on appropriate handling.",
            },
          ],
        },
        {
          type: "sub",
          id: "s3-3",
          heading: "3.3 Security Measures",
          blocks: [
            {
              type: "p",
              text: "W3 Sourcing maintains appropriate administrative, technical, and physical safeguards designed to protect Personal Data against unauthorised access, disclosure, alteration, or loss.",
            },
          ],
        },
        {
          type: "sub",
          id: "s3-4",
          heading: "3.4 Sub-processors",
          blocks: [
            {
              type: "p",
              text: "W3 Sourcing may engage sub-processors (e.g., secure cloud providers, recruitment platforms) to support service delivery, under written terms that provide a level of protection no less protective than this DPA. W3 Sourcing remains responsible for sub-processors.",
            },
          ],
        },
        {
          type: "sub",
          id: "s3-5",
          heading: "3.5 Assistance With Rights Requests",
          blocks: [
            {
              type: "p",
              text: "W3 Sourcing shall reasonably assist the Client to respond to verified requests relating to Client Personal Data (access, deletion, correction, restriction), where required by law.",
            },
          ],
        },
        {
          type: "sub",
          id: "s3-6",
          heading: "3.6 Deletion/Return",
          blocks: [
            {
              type: "p",
              text: "Upon termination, W3 Sourcing will delete or return Client Personal Data, subject to legal retention requirements and secure archiving obligations.",
            },
          ],
        },
      ],
    },

    {
      id: "s4",
      heading: "4. Harmonised Breach Notification",
      blocks: [
        {
          type: "p",
          text: "W3 Sourcing shall notify the Client without undue delay, and in any event no later than seventy-two (72) hours after becoming aware of a confirmed Personal Data Breach affecting Personal Data processed under this DPA, unless a shorter period is required by law.",
        },
        {
          type: "p",
          text: "Notifications will include, to the extent reasonably available: (a) the nature of the breach; (b) categories/approximate volume of data affected; (c) likely consequences; and (d) mitigation steps. W3 Sourcing will cooperate reasonably to support regulatory or data subject notification obligations.",
        },
      ],
    },

    {
      id: "s5",
      heading: "5. International Transfers",
      blocks: [
        {
          type: "p",
          text: "Where transfers occur across borders, the parties will implement appropriate safeguards required by law (e.g., SCCs/IDTA or equivalent contractual safeguards).",
        },
      ],
    },

    {
      id: "s6",
      heading: "6. Audits and Information",
      blocks: [
        {
          type: "p",
          text: "On reasonable notice, W3 Sourcing will provide information reasonably necessary to demonstrate compliance with this DPA, subject to confidentiality and security constraints.",
        },
      ],
    },

    {
      id: "s7",
      heading: "7. AI-Assisted Note-Taking and Transcription",
      blocks: [
        {
          type: "p",
          text: "Where W3 Sourcing uses AI-assisted note-taking tools, including Fathom and Paraform, these tools are deployed solely within private, business-controlled environments. Personal Data processed through these tools:",
        },
        {
          type: "ul",
          items: [
            "remains accessible only to authorised W3 Sourcing personnel;",
            "is not sold, licensed, or shared for unrelated purposes;",
            "is not used to train public or third-party AI models; and",
            "is retained/deleted in accordance with contractual requirements and applicable law.",
          ],
        },
        {
          type: "p",
          text: "Use of such tools does not replace human decision-making and does not involve automated hiring decisions.",
        },
      ],
    },

    {
      id: "s8",
      heading: "8. No Sale / No Ad-Tech Use (US)",
      blocks: [
        {
          type: "p",
          text: 'W3 Sourcing does not "sell" Personal Data or "share" Personal Data for cross-context behavioural advertising, as those terms are defined under CPRA/CCPA.',
        },
      ],
    },

    {
      id: "s9",
      heading: "9. Data Retention",
      blocks: [
        {
          type: "p",
          text: "W3 Sourcing retains Personal Data only as long as necessary for recruitment purposes, to meet legal obligations, and for legitimate business needs. Retention periods may differ by data type and jurisdiction.",
        },
      ],
    },

    {
      id: "s10",
      heading: "10. Order of Precedence",
      blocks: [
        {
          type: "p",
          text: "In the event of conflict:",
        },
        {
          type: "ol",
          items: ["Applicable jurisdiction schedule", "This Master DPA", "Agreement"],
        },
      ],
    },

    {
      id: "s11",
      heading: "11. Candidate Processing Terms (W3 Sourcing as Controller)",
      blocks: [
        {
          type: "sub",
          id: "s11-1",
          heading: "11.1 Purpose and Use",
          blocks: [
            {
              type: "p",
              text: "W3 Sourcing processes Candidate Personal Data to:",
            },
            {
              type: "ul",
              items: [
                "assess suitability for roles;",
                "present candidates to prospective employers (with candidate knowledge/instruction);",
                "arrange interviews and manage recruitment processes; and",
                "maintain a talent network for future opportunities.",
              ],
            },
          ],
        },
        {
          type: "sub",
          id: "s11-2",
          heading: "11.2 Candidate Data Sharing",
          blocks: [
            {
              type: "p",
              text: "Candidate Personal Data is shared with clients only where necessary for recruitment and typically with the candidate's knowledge or instruction. W3 Sourcing will not publish Candidate Personal Data publicly.",
            },
          ],
        },
        {
          type: "sub",
          id: "s11-3",
          heading: "11.3 Candidate Rights",
          blocks: [
            {
              type: "p",
              text: "Candidates may request access, correction, deletion, or restriction of their data, subject to legal requirements. Requests can be made via the contact methods on W3 Sourcing's website.",
            },
          ],
        },
        {
          type: "sub",
          id: "s11-4",
          heading: "11.4 Lawful Bases",
          blocks: [
            {
              type: "p",
              text: "Where applicable, W3 Sourcing relies on contractual necessity, legitimate interests, legal obligation, and/or consent, depending on jurisdiction and context.",
            },
          ],
        },
      ],
    },

    {
      id: "s12",
      heading: "12. Jurisdictional Schedules",
      blocks: [
        {
          type: "ul",
          items: [
            "Schedule 1: United States (CCPA/CPRA-style service provider terms)",
            "Schedule 2: New York (NY SHIELD Act security program expectations)",
            "Schedule 3: UK GDPR (Article 28 processor terms)",
            "Schedule 4: EU GDPR (Article 28 processor terms)",
            "Schedule 5: Singapore PDPA",
            "Schedule 6: Hong Kong PDPO",
            "Schedule 7: UAE PDPL",
          ],
        },
      ],
    },

    {
      id: "schedule-8",
      heading: "Schedule 8 \u2013 California (San Francisco Tech & Legal Recruitment Addendum)",
      blocks: [
        {
          type: "p",
          text: "This Schedule applies where Personal Data includes information relating to California residents, including candidates and client representatives involved in technology, legal, financial services, or regulated professional roles, and supplements the Master Data Processing Addendum.",
        },
        {
          type: "p",
          text: "Where there is any conflict between this Schedule and the Master DPA, this Schedule shall prevail for California Personal Data.",
        },
        {
          type: "sub",
          id: "sch8-s1",
          heading: "1. Regulatory Framework",
          blocks: [
            {
              type: "p",
              text: "This Schedule is intended to satisfy applicable requirements under:",
            },
            {
              type: "ul",
              items: [
                "The California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA)",
                "California common-law confidentiality obligations",
                "Professional confidentiality expectations applicable to legal, technology, and regulated roles, including attorney-client privilege considerations where relevant",
              ],
            },
          ],
        },
        {
          type: "sub",
          id: "sch8-s2",
          heading: "2. Service Provider Status",
          blocks: [
            {
              type: "p",
              text: "For purposes of the CPRA, W3 Sourcing acts as a Service Provider when processing Client Personal Data on behalf of a Client and shall:",
            },
            {
              type: "ul",
              items: [
                "Process Personal Data solely to provide recruitment and advisory services",
                "Not sell Personal Data",
                "Not share Personal Data for cross-context behavioural advertising",
                "Not retain, use, or disclose Personal Data outside the business purpose defined in the Agreement",
              ],
            },
          ],
        },
        {
          type: "sub",
          id: "sch8-s3",
          heading: "3. Categories of Personal Data (Role-Specific)",
          blocks: [
            {
              type: "p",
              text: "For technology and legal recruitment in California, Personal Data processed may include:",
            },
            {
              type: "ul",
              items: [
                "Professional identifiers and business contact information",
                "Employment history, qualifications, and technical or legal experience",
                "Interview feedback and assessment notes",
                "Role-specific information relating to regulatory, compliance, or practice area experience",
              ],
            },
            {
              type: "p",
              text: "W3 Sourcing does not intentionally collect sensitive personal information unless strictly necessary for recruitment or legal compliance purposes.",
            },
          ],
        },
        {
          type: "sub",
          id: "sch8-s4",
          heading: "4. Confidentiality & Privilege Awareness (Legal Roles)",
          blocks: [
            {
              type: "p",
              text: "Where recruitment relates to legal roles, W3 Sourcing acknowledges the heightened confidentiality expectations associated with legal hiring and shall:",
            },
            {
              type: "ul",
              items: [
                "Limit access to candidate information to authorised personnel only",
                "Treat candidate communications and interview materials as confidential",
                "Avoid disclosure of candidate information that could reasonably be subject to attorney-client privilege or professional secrecy obligations",
                "Process such information solely for recruitment purposes and not for analysis, publication, or unrelated use",
              ],
            },
          ],
        },
        {
          type: "sub",
          id: "sch8-s5",
          heading: "5. Use of AI-Assisted Tools in California Engagements",
          blocks: [
            {
              type: "p",
              text: "Where AI-assisted note-taking or transcription tools are used in California-based engagements:",
            },
            {
              type: "ul",
              items: [
                "Tools are deployed only within private, business-controlled environments",
                "Personal Data is not used to train public or third-party AI models",
                "Data is not shared with third parties for advertising or profiling",
                "Use of such tools does not involve automated hiring decisions and does not replace human evaluation",
              ],
            },
          ],
        },
        {
          type: "sub",
          id: "sch8-s6",
          heading: "6. Consumer Rights Support",
          blocks: [
            {
              type: "p",
              text: "Where required under California law, W3 Sourcing shall reasonably assist the Client in responding to verified California consumer requests, including requests to:",
            },
            {
              type: "ul",
              items: [
                "Know what Personal Data has been collected",
                "Delete Personal Data (subject to statutory exceptions)",
                "Correct inaccurate Personal Data",
              ],
            },
            {
              type: "p",
              text: "W3 Sourcing shall not discriminate against any individual for exercising their rights under the CPRA.",
            },
          ],
        },
        {
          type: "sub",
          id: "sch8-s7",
          heading: "7. Data Retention (California Context)",
          blocks: [
            {
              type: "p",
              text: "Personal Data relating to California candidates and client representatives shall be retained only for as long as reasonably necessary to:",
            },
            {
              type: "ul",
              items: [
                "Support recruitment services",
                "Comply with legal, regulatory, or professional obligations",
                "Maintain appropriate recruitment records",
              ],
            },
            {
              type: "p",
              text: "Data no longer required shall be securely deleted or anonymised.",
            },
          ],
        },
        {
          type: "sub",
          id: "sch8-s8",
          heading: "8. Incident Response and Notification",
          blocks: [
            {
              type: "p",
              text: "Any Personal Data Breach involving California Personal Data shall be handled in accordance with the Harmonised Breach Notification Clause in the Master DPA and applicable California breach notification laws.",
            },
          ],
        },
        {
          type: "sub",
          id: "sch8-s9",
          heading: "9. San Francisco Market Expectations",
          blocks: [
            {
              type: "p",
              text: "The parties acknowledge that recruitment engagements in San Francisco often involve heightened expectations around:",
            },
            {
              type: "ul",
              items: [
                "Data minimisation",
                "Confidentiality of senior-level and in-market candidates",
                "Protection of sensitive technical and legal background information",
              ],
            },
            {
              type: "p",
              text: "W3 Sourcing agrees to process Personal Data in a manner consistent with these market norms and applicable law.",
            },
          ],
        },
      ],
    },
  ],

  contactEmail: "hello@w3sourcing.com",
  addresses: [
    "W3 Sourcing\n128 City Road\nLondon\nEC1V 2NX",
    "Far East Finance Building\n14 Robinson Road #08-01\nSingapore\n048545\nUEN: 201408362k\nEA: 22S1392",
  ],
};

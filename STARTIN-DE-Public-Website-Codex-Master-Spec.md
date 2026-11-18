# STARTIN-DE — Public Website, Content, Design & Pricing
## Codex implementation master specification · Version 1.0 · 18 November 2026

> **Purpose:** Build the public-facing STARTIN-DE website around the existing, working authentication and Document Check Centre. This is an implementation specification, not merely a design concept. Preserve existing features and data. Implement real responsive pages, localized copy, accessible navigation, SEO, pricing presentation and content architecture.
>
> **Important distinction:** Prices and future services below are **proposals**, not verified offers. Do not activate checkout or claim a service is available until the business owner confirms operational readiness and legal clearance.

---

## 0. Codex operating instructions — read first

You are the technical lead, product designer and implementation engineer. Inspect the current repository before making changes. The existing sign-in, document upload, processing and report workflows must remain functional. Do not rebuild or replace them. Reuse the established Next.js/TypeScript/Supabase stack and design conventions where appropriate. Make a short plan, implement in logical increments, run lint/typecheck/tests/build, and report exact changes, assumptions and remaining tasks.

**Do not:** invent testimonials, success rates, partner relationships, job openings, legal requirements, live service availability, photos of actual customers, endorsements, review counts, regulatory licences or guarantees. Do not publish AI-generated legal advice as fact. Do not create fake functional CTAs. Do not silently enable payments. Do not overwrite original images. Do not expose API keys or modify private document permissions.

**Build objective:** An unauthenticated visitor landing on `/` or `/vi` must immediately understand what STARTIN-DE does, who it serves, why it is credible and what to do next. The existing Document Check Centre should be an accessible tool within the wider public website, not the entire brand experience.

**Primary launch market:** Vietnamese candidates exploring Ausbildung in Germany. Secondary: parents, German employers/education partners, and international visitors. Three languages: Vietnamese (default), German and English. Ausbildung is the flagship; Study and Work are informational pathways at launch.

**First action:** inspect repository routes, auth, database, i18n, styling, logo, image assets, deployment and existing Document Check Centre; identify any conflicts with this specification. If the existing repo has working conventions, adapt rather than force the example routes below.

---

## 1. Brand and positioning

**Brand:** STARTIN-DE

**Core English line:** Your future in Germany starts here.

**Core Vietnamese line:** Hành trình Đức bắt đầu từ đây.

**Core German line:** Dein Weg nach Deutschland beginnt hier.

**One-sentence positioning:** STARTIN-DE helps people in Vietnam explore Ausbildung, study and career pathways in Germany through reliable information, practical preparation tools and transparent guidance.

**Not:** a visa-selling service, guaranteed placement service, official government portal, certified qualification-recognition authority or document-authentication agency.

**Personality:** trustworthy, clear, optimistic but grounded, practical, human, modern, respectful. Speak to people with ambition without exaggerating outcomes. Avoid aggressive recruitment agency tropes, visa stamps, waving flags, fabricated success stories and unrealistic salary promises.

**Audience priorities:**
1. Vietnamese students/school leavers and early-career adults considering Ausbildung.
2. Parents seeking trustworthy information and transparent costs.
3. German employers, chambers, schools and training partners.
4. Vietnamese applicants interested in study or qualified employment.

**Trust pillars:** Transparent information; practical tools; verifiable sources; honest limits; human support where actually available.

---

## 2. Information architecture and routes

Public navigation (localize labels): **Ausbildung | Study | Work | Opportunities | Tools | Guides | About**. Right side: language switcher, Sign in, primary CTA **Explore your path** (only when Path Finder is live; until then use **Check your documents** or **Explore Ausbildung**).

Suggested public routes, with locale prefix:

```
/                       redirect to /vi/ or locale negotiation with /vi/ default
/vi/                    homepage
/vi/ausbildung          flagship pathway landing page
/vi/study               informational pathway page
/vi/work                informational pathway page
/vi/opportunities       honest informational / coming-soon page until verified listings exist
/vi/tools               tools directory
/vi/tools/document-check public explanation of existing tool
/vi/pricing             transparent pricing
/vi/services            service directory
/vi/services/[slug]     individual service details
/vi/guides              article directory
/vi/guides/[slug]       individual guides
/vi/about               brand, principles, transparency
/vi/partners            German employers/institutions landing page
/vi/contact             contact form or real contact channels
/vi/privacy             privacy notice (approved copy required)
/vi/terms               terms (approved copy required)
/vi/refunds             refund/cancellation terms (approved copy required)
/de/...                 German equivalents
/en/...                 English equivalents

/app/...                 existing authenticated application, preserve
/auth/...                existing authentication, preserve
```

Keep existing route paths when changing them would break auth callbacks, stored links or the Document Check Centre. Add redirects only if safe and tested. Public pages must never require sign-in. Sign-in is required only for private tools, saved documents, reports and candidate data.

**Footer:** pathways, tools, services/pricing, guides, about, partners, contact, privacy, terms, language selector, copyright, and a concise no-guarantees notice. Include legal company details only if provided and verified; otherwise mark them as a launch-blocking content task rather than inventing them.

---

## 3. Design system

### 3.1 Visual direction

Premium, modern European editorial education/career platform; warm, trustworthy, spacious, mobile-first. Real people and authentic German settings rather than generic visa-agency visuals.

**Suggested palette** (adapt to existing STARTIN-DE logo):
- Navy `#14283F` — primary headings/navigation
- Warm white `#F8F9F6` — backgrounds
- Green `#23866D` — accent/primary action
- White `#FFFFFF` — cards
- Text charcoal `#24313C`
- Muted text `#64717D`
- Light border `#E3E8E5`
- Alert colors must meet accessible contrast.

**Typography:** Manrope or Inter (check licensing and existing font setup), good Vietnamese diacritic coverage, clean German typography. Use variable font or subset loading where possible. No decorative serif required.

**Design principles:** large but not oversized hero; restrained photography; clear content hierarchy; meaningful whitespace; generous mobile tap targets; max-width content container; minimal animation; accessible forms and status indicators; no distracting gradients or fake social proof.

**Responsive:** mobile first; functional at 320px; tablet; desktop; avoid horizontal scrolling. Check Vietnamese long strings and German compound words.

**Accessibility:** WCAG-oriented semantics, keyboard navigation, visible focus, reduced-motion preference, alt text, color contrast, form labels, skip link, accessible mobile menu and locale switcher.

### 3.2 Reusable components

`PublicHeader`, `LocaleSwitcher`, `MobileNavigation`, `PublicFooter`, `Hero`, `SectionHeading`, `PathwayCard`, `ToolCard`, `GuideCard`, `TrustPrinciple`, `StepTimeline`, `PricingCard`, `PricingComparison`, `AvailabilityLabel`, `FAQAccordion`, `SourceReference`, `ContentLastReviewed`, `LeadCTA`, `ContactForm`, `Breadcrumbs`, `EmptyState`.

Implement consistent loading/error/empty states. Use icons sparingly. Avoid introducing a second design framework if the repository already has one.

---

## 4. Image and asset handoff — user-provided photos and logo

The owner will place source images and logo assets into the project repository. **Do not require all images to be present before building layouts.** Support graceful neutral placeholders and list missing image needs in the completion report.

Recommended incoming directory:

```
assets/incoming/
  logo/
  hero/
  ausbildung/
  study/
  work/
  people/
  guides/
  partners/
```

The owner may instead drop everything into `assets/incoming/`; inspect files and organize intelligently. If filenames are ambiguous, generate a simple `assets/image-manifest.md` and ask for confirmation on ambiguous placements. Do not guess the identity, occupation, nationality or consent status of depicted people.

**Agent instructions:**
1. Inventory incoming images; inspect aspect ratio, dimensions, format and subject matter.
2. Preserve originals in `assets/incoming/` (or source location); copy optimized versions to `public/images/`.
3. Organize output: `public/images/brand/`, `hero/`, `pathways/`, `tools/`, `guides/`, `partners/`.
4. Use descriptive kebab-case filenames; convert to AVIF/WebP when suitable, keeping transparency where needed.
5. Use Next.js `Image` (or current framework equivalent), correct sizes, lazy loading below the fold and priority only for primary hero.
6. Write meaningful alt text for informative images; empty alt for decorative images.
7. Avoid duplicating one stock photo across many unrelated pages.
8. Do not use an image for a real employer, student testimonial or partner endorsement without evidence and permission.
9. Prefer real uploaded brand imagery; no auto-fetching copyrighted stock images without permission.
10. Never replace the existing STARTIN-DE logo with a generated logo.

Suggested placements: hero image = authentic young adult(s) in Germany; Ausbildung = real training environments (hospitality, industrial/technical); Study = university campus; Work = skilled professional environment; Guides = relevant documentary/editorial photography. The public Document Check landing page should primarily use a real product screenshot/illustration derived from the built UI, not a fabricated dashboard screenshot.

---

## 5. Page-by-page implementation and complete core copy

The following copy is launch-ready **marketing draft**, subject to owner review. Use the text as the source of truth, not filler or lorem ipsum. Keep translations natural rather than mechanically identical. Create structured locale dictionaries or content files, with stable message keys. The source language for candidate acquisition is Vietnamese.

### 5.1 Homepage `/[locale]/`

**Sections in this exact order:**
1. Hero with clear positioning and 2 CTAs.
2. Three pathways (Ausbildung flagship, Study, Work).
3. Practical tools (Document Check available; others planned).
4. Four-step journey.
5. Why STARTIN-DE / transparency principles.
6. Featured guides (real published guides only).
7. Services/pricing teaser (no unavailable checkout).
8. German partner invitation.
9. Final CTA and footer.

#### Hero copy

**VI**
- Eyebrow: `TỪ VIỆT NAM ĐẾN ĐỨC`
- H1: `Tương lai của bạn tại Đức bắt đầu từ đây.`
- Body: `Bạn đang tìm hiểu về học nghề Ausbildung, du học hoặc cơ hội làm việc tại Đức? STARTIN-DE giúp bạn khám phá các hướng đi, hiểu rõ yêu cầu và chuẩn bị từng bước với thông tin đáng tin cậy cùng những công cụ thiết thực.`
- Primary CTA: `Khám phá Ausbildung`
- Secondary CTA: `Kiểm tra hồ sơ`
- Reassurance: `Thông tin rõ ràng. Chuẩn bị thực tế. Không hứa hẹn kết quả được bảo đảm.`

**DE**
- Eyebrow: `VON VIETNAM NACH DEUTSCHLAND`
- H1: `Deine Zukunft in Deutschland beginnt hier.`
- Body: `Du interessierst dich für eine Ausbildung, ein Studium oder berufliche Perspektiven in Deutschland? STARTIN-DE hilft dir, Wege zu entdecken, Anforderungen zu verstehen und dich mit verlässlichen Informationen und praktischen Werkzeugen vorzubereiten.`
- Primary CTA: `Ausbildung entdecken`
- Secondary CTA: `Unterlagen prüfen`
- Reassurance: `Klare Informationen. Praktische Vorbereitung. Keine Erfolgsgarantien.`

**EN**
- Eyebrow: `FROM VIETNAM TO GERMANY`
- H1: `Your future in Germany starts here.`
- Body: `Considering vocational training, studying or working in Germany? STARTIN-DE helps you explore your options, understand the requirements and prepare with reliable information and practical tools.`
- Primary CTA: `Explore Ausbildung`
- Secondary CTA: `Check your documents`
- Reassurance: `Clear information. Practical preparation. No unrealistic guarantees.`

#### Three pathways cards

**VI**
- Ausbildung: `Học nghề Ausbildung` / `Khám phá chương trình đào tạo nghề tại Đức, kết hợp học tập và thực hành tại doanh nghiệp.` / CTA `Tìm hiểu Ausbildung`
- Study: `Du học Đức` / `Tìm hiểu các chương trình học, yêu cầu đầu vào và những bước chuẩn bị cho hành trình học tập.` / CTA `Khám phá du học`
- Work: `Làm việc tại Đức` / `Tìm hiểu con đường nghề nghiệp, kỹ năng và điều kiện có thể áp dụng cho lao động có chuyên môn.` / CTA `Khám phá cơ hội nghề nghiệp`

**DE**
- Ausbildung: `Berufsausbildung` / `Entdecke die berufliche Ausbildung in Deutschland mit Lernen und Praxis im Betrieb.` / CTA `Ausbildung ansehen`
- Study: `Studium` / `Informiere dich über Studienmöglichkeiten, Zugangsvoraussetzungen und Vorbereitung.` / CTA `Studium entdecken`
- Work: `Arbeiten` / `Erfahre mehr über berufliche Wege, Qualifikationen und mögliche Voraussetzungen.` / CTA `Berufliche Wege ansehen`

**EN**
- Ausbildung: `Vocational training` / `Explore Ausbildung programmes combining learning with practical training at an employer.` / CTA `Explore Ausbildung`
- Study: `Study` / `Understand study pathways, entry requirements and preparation steps.` / CTA `Explore study`
- Work: `Work` / `Learn about skilled employment routes, qualifications and relevant requirements.` / CTA `Explore work`

Add a subtle `Our initial focus` / `Trọng tâm hiện tại` / `Unser Schwerpunkt` label on Ausbildung only.

#### Tools section

**VI** heading: `Công cụ giúp bạn chuẩn bị tốt hơn` / intro: `Không chỉ đọc thông tin — hãy bắt đầu bằng những bước cụ thể.`
**DE** heading: `Werkzeuge für deine Vorbereitung` / intro: `Nicht nur informieren — sondern konkrete Schritte gehen.`
**EN** heading: `Practical tools for your next step` / intro: `Go beyond reading and start preparing.`

Tool cards:
- Document Check — **available only if existing tool actually works**. VI: `Kiểm tra hồ sơ` / `Tải CV hoặc thư động lực lên để nhận nhận xét có cấu trúc về nội dung, ngôn ngữ và những điểm cần cải thiện.` DE: `Dokumenten-Check` / `Lade deinen Lebenslauf oder dein Anschreiben hoch und erhalte strukturiertes Feedback zu Inhalt, Sprache und Verbesserungsmöglichkeiten.` EN: `Document Check` / `Upload a CV or motivation letter for structured feedback on content, language and areas to improve.`
- Germany Path Finder — planned. VI: `Định hướng lộ trình Đức` / `Công cụ đánh giá ban đầu dựa trên mục tiêu và tình hình của bạn.` DE: `Deutschland-Wegweiser` / `Eine erste Orientierung anhand deiner Ziele und Ausgangslage.` EN: `Germany Path Finder` / `An initial pathway assessment based on your goals and background.`
- Cost Planner — planned. VI: `Dự toán chi phí` / `Lập kế hoạch tài chính cho quá trình chuẩn bị và cuộc sống tại Đức.` DE: `Kostenplaner` / `Plane mögliche Ausgaben für Vorbereitung und Alltag in Deutschland.` EN: `Cost Planner` / `Plan potential preparation and living costs.`
- Opportunities — planned until verified listings exist. VI: `Cơ hội Ausbildung` / `Tìm hiểu các vị trí đào tạo nghề với thông tin được kiểm tra nguồn.` DE: `Ausbildungsangebote` / `Informiere dich über Ausbildungsstellen mit nachvollziehbaren Quellen.` EN: `Ausbildung Opportunities` / `Explore vocational training opportunities with verifiable sources.`

#### Four-step journey

**VI:** `Khám phá` — `Hiểu các hướng đi phù hợp với mục tiêu của bạn.`; `Đánh giá` — `Xem xét yêu cầu, kỹ năng ngôn ngữ và hồ sơ hiện có.`; `Chuẩn bị` — `Cải thiện giấy tờ, kế hoạch và kỹ năng ứng tuyển.`; `Tiến bước` — `Sử dụng thông tin và sự hỗ trợ phù hợp để chủ động thực hiện bước tiếp theo.`

**DE:** `Entdecken` — `Lerne Wege kennen, die zu deinen Zielen passen.`; `Einordnen` — `Prüfe Anforderungen, Sprachkenntnisse und vorhandene Unterlagen.`; `Vorbereiten` — `Verbessere Unterlagen, Planung und Bewerbungsfähigkeiten.`; `Weitergehen` — `Nutze passende Informationen und Unterstützung für deine nächsten Schritte.`

**EN:** `Explore` — `Understand pathways that may fit your goals.`; `Assess` — `Review requirements, language skills and existing documents.`; `Prepare` — `Improve documents, planning and application skills.`; `Move forward` — `Use suitable resources and support to take your next steps.`

#### Trust section

**VI** heading: `Rõ ràng ngay từ đầu`; principles: `Thông tin có nguồn` — `Ưu tiên tài liệu và hướng dẫn từ các cơ quan chính thức.`; `Công cụ thiết thực` — `Giúp bạn nhận ra những điểm cần chuẩn bị và cải thiện.`; `Không cam kết viển vông` — `Không bảo đảm visa, hợp đồng Ausbildung hay kết quả tuyển chọn.`

**DE** heading: `Von Anfang an transparent`; principles: `Nachvollziehbare Quellen` — `Wir orientieren uns an Informationen offizieller Stellen.`; `Praktische Werkzeuge` — `Wir helfen dir, Vorbereitungsbedarf zu erkennen.`; `Keine unrealistischen Versprechen` — `Keine Garantie für Visa, Ausbildungsplätze oder Zusagen.`

**EN** heading: `Transparency from the start`; principles: `Verifiable sources` — `We prioritize guidance from official institutions.`; `Practical tools` — `We help you identify what to prepare and improve.`; `No unrealistic promises` — `We do not guarantee visas, placements or acceptance.`

#### Homepage pricing teaser

**VI:** `Bắt đầu miễn phí. Chọn thêm hỗ trợ khi cần.` / `Khám phá tài nguyên miễn phí và xem rõ phạm vi, chi phí của từng dịch vụ.` / CTA `Xem dịch vụ và bảng giá`
**DE:** `Kostenlos starten. Bei Bedarf mehr Unterstützung wählen.` / `Entdecke freie Ressourcen und transparente Informationen zu Leistungsumfang und Preisen.` / CTA `Leistungen und Preise ansehen`
**EN:** `Start free. Choose extra support when you need it.` / `Explore free resources and see clearly what each service includes and costs.` / CTA `View services and pricing`

#### Final CTA

**VI:** `Hành trình của bạn bắt đầu từ một bước nhỏ.` / `Tìm hiểu Ausbildung hoặc kiểm tra hồ sơ hiện có của bạn ngay hôm nay.`
**DE:** `Dein Weg beginnt mit einem ersten Schritt.` / `Informiere dich über Ausbildung oder prüfe deine vorhandenen Unterlagen.`
**EN:** `Your journey begins with one step.` / `Explore Ausbildung or check your current application documents today.`

### 5.2 Ausbildung `/[locale]/ausbildung`

This is the flagship educational landing page. Use helpful evergreen explanation, not definitive immigration advice. Include: what Ausbildung is; dual vs school-based training as broad categories; who it may suit; example sectors (hospitality and technical as initial focus); language preparation; application documents; general application process; practical realities; FAQ; official-source links; document-check CTA; optional assessment CTA only if service is live.

**VI:**
- H1: `Ausbildung tại Đức: Hiểu đúng trước khi bắt đầu`
- Lead: `Ausbildung là một con đường đào tạo nghề tại Đức. Tùy chương trình, người học có thể kết hợp học lý thuyết với thực hành tại doanh nghiệp hoặc học theo mô hình trường nghề. Điều kiện cụ thể phụ thuộc vào nghề, cơ sở đào tạo và hoàn cảnh của từng ứng viên.`
- Section headings: `Ausbildung là gì?`; `Những ngành nghề đáng tìm hiểu`; `Bạn cần chuẩn bị những gì?`; `Quy trình ứng tuyển tổng quan`; `Những câu hỏi thường gặp`.
- CTA: `Kiểm tra CV và thư động lực`
- Note: `Thông tin mang tính định hướng. Hãy kiểm tra yêu cầu mới nhất với cơ sở đào tạo, nhà tuyển dụng và cơ quan có thẩm quyền.`

**DE:**
- H1: `Ausbildung in Deutschland: Gut informiert starten`
- Lead: `Eine Ausbildung eröffnet Wege in verschiedene Berufe. Je nach Ausbildungsform werden Unterricht und praktische Erfahrung im Betrieb oder an einer Berufsfachschule miteinander verbunden. Konkrete Voraussetzungen unterscheiden sich nach Beruf, Einrichtung und persönlicher Situation.`
- Section headings: `Was ist eine Ausbildung?`; `Berufsfelder entdecken`; `Was solltest du vorbereiten?`; `Bewerbung im Überblick`; `Häufige Fragen`.
- CTA: `Lebenslauf und Anschreiben prüfen`
- Note: `Diese Informationen dienen der Orientierung. Prüfe aktuelle Anforderungen bei Ausbildungsbetrieben, Bildungseinrichtungen und zuständigen Behörden.`

**EN:**
- H1: `Ausbildung in Germany: Understand your options`
- Lead: `Ausbildung is a vocational training pathway in Germany. Depending on the programme, learning may combine classroom instruction with practical training at an employer or take place primarily at a vocational school. Specific requirements vary by occupation, institution and individual circumstances.`
- Section headings: `What is Ausbildung?`; `Occupations to explore`; `What should you prepare?`; `Application process at a glance`; `Frequently asked questions`.
- CTA: `Check your CV and motivation letter`
- Note: `This information is for orientation. Always verify current requirements with training providers, employers and the responsible authorities.`

**Sector examples:** hospitality (hotel, restaurant, cooking), technical/industrial (mechatronics, electronics, mechanics), and potentially logistics/commercial later. Do not imply STARTIN-DE has open positions in any sector unless verified.

**FAQ topics** (write cautious, useful answers with official sources): What is Ausbildung? Is there a universal age limit? What German level is needed? Are all programmes paid? What documents are commonly needed? Is placement or visa approval guaranteed? How to verify an employer or opportunity? For age, language, pay, visas and financial requirements, avoid unqualified blanket statements; link to current official sources and show review dates.

### 5.3 Study `/[locale]/study`

Informational launch page; do not pretend full admissions consulting is already operational.

- **VI H1:** `Du học Đức: Bắt đầu từ thông tin đáng tin cậy`
  - Lead: `Tìm hiểu các loại chương trình học, điều kiện đầu vào, ngôn ngữ giảng dạy, hồ sơ và kế hoạch tài chính trước khi lựa chọn hướng đi phù hợp.`
  - CTA: `Đọc hướng dẫn du học`
- **DE H1:** `Studieren in Deutschland: Gut vorbereitet entscheiden`
  - Lead: `Informiere dich über Studienangebote, Zugangsvoraussetzungen, Unterrichtssprachen, Unterlagen und finanzielle Planung, bevor du deinen Weg wählst.`
  - CTA: `Studienratgeber lesen`
- **EN H1:** `Study in Germany: Make an informed start`
  - Lead: `Explore programme types, admissions requirements, teaching languages, documents and financial planning before choosing your direction.`
  - CTA: `Read study guides`

Provide links to official university/admissions information; clearly label advanced advisory services as not yet offered if applicable.

### 5.4 Work `/[locale]/work`

Informational launch page; distinguish skilled employment from Ausbildung.

- **VI H1:** `Làm việc tại Đức: Hiểu con đường phù hợp`
  - Lead: `Tìm hiểu các hướng đi dành cho người có chuyên môn, yêu cầu về bằng cấp, kỹ năng, tiếng Đức và những bước chuẩn bị cần thiết.`
  - CTA: `Tìm hiểu con đường nghề nghiệp`
- **DE H1:** `Arbeiten in Deutschland: Berufliche Wege verstehen`
  - Lead: `Entdecke Möglichkeiten für qualifizierte Fachkräfte und informiere dich über Abschlüsse, Kompetenzen, Sprache und Vorbereitung.`
  - CTA: `Berufliche Wege entdecken`
- **EN H1:** `Work in Germany: Understand your pathway`
  - Lead: `Explore routes for skilled professionals and learn about qualifications, skills, language and preparation.`
  - CTA: `Explore career pathways`

Do not provide individual visa eligibility verdicts.

### 5.5 Public Document Check landing `/[locale]/tools/document-check`

This page must explain the existing working service **before** asking for login.

**VI**
- H1: `Kiểm tra hồ sơ ứng tuyển Đức trước khi gửi`
- Lead: `Tải CV hoặc thư động lực lên để nhận phản hồi có cấu trúc về nội dung, cách trình bày và tiếng Đức. Công cụ giúp bạn nhận ra những điểm cần cải thiện trước khi ứng tuyển.`
- How it works: `1. Chọn loại tài liệu` / `2. Tải tệp lên an toàn` / `3. Xem nhận xét và gợi ý cải thiện`
- CTA: `Bắt đầu kiểm tra hồ sơ`
- Disclaimer: `Đây là công cụ hỗ trợ chuẩn bị hồ sơ, không phải dịch vụ chứng thực giấy tờ, công nhận bằng cấp hoặc bảo đảm kết quả ứng tuyển.`

**DE**
- H1: `Bewerbungsunterlagen prüfen, bevor du sie versendest`
- Lead: `Lade deinen Lebenslauf oder dein Anschreiben hoch und erhalte strukturiertes Feedback zu Inhalt, Aufbau und deutscher Sprache. So erkennst du Verbesserungsmöglichkeiten vor deiner Bewerbung.`
- How it works: `1. Dokumenttyp wählen` / `2. Datei sicher hochladen` / `3. Feedback und Verbesserungsvorschläge ansehen`
- CTA: `Dokumenten-Check starten`
- Disclaimer: `Das Werkzeug unterstützt die Vorbereitung. Es bestätigt weder Echtheit noch Anerkennung von Dokumenten und garantiert keinen Bewerbungserfolg.`

**EN**
- H1: `Review your German application documents before you apply`
- Lead: `Upload a CV or motivation letter to receive structured feedback on content, layout and German writing. Identify improvements before submitting your application.`
- How it works: `1. Select document type` / `2. Upload securely` / `3. Review feedback and suggestions`
- CTA: `Start document check`
- Disclaimer: `This is an application preparation tool, not document authentication, qualification recognition or a guarantee of acceptance.`

**Important:** Only list document types actually supported by the current implementation. If the system does not yet support OCR or certificates, do not advertise those as working. Public CTA links to existing auth flow with safe post-login return to document upload. No public file upload bypassing auth.

### 5.6 Tools directory `/[locale]/tools`

List live and planned tools with honest status badges. Do not use dead CTAs for planned tools; use `Coming soon` with optional email interest capture only if consent and mailing infrastructure exist.

### 5.7 Opportunities `/[locale]/opportunities`

Until a real verified opportunity database exists, show an honest explanation of how STARTIN-DE will verify opportunities and link to official job-search resources. **No fabricated vacancies, salary ranges, employer names or start dates.**

- VI H1: `Tìm hiểu cơ hội Ausbildung tại Đức` / Lead: `Chúng tôi đang phát triển khu vực tổng hợp cơ hội với nguồn tin có thể kiểm tra. Trong thời gian này, bạn có thể bắt đầu bằng các kênh tìm kiếm chính thức và chuẩn bị hồ sơ ứng tuyển.`
- DE H1: `Ausbildungsangebote entdecken` / Lead: `Wir entwickeln einen Bereich für nachvollziehbar recherchierte Ausbildungsangebote. Bis dahin helfen offizielle Suchportale und gut vorbereitete Bewerbungsunterlagen beim Einstieg.`
- EN H1: `Explore Ausbildung opportunities` / Lead: `We are developing a directory of opportunities with verifiable sources. In the meantime, official search portals and well-prepared application documents are a useful starting point.`

When live listings are added, require employer, occupation, source URL, location, start date, published requirements and last-checked date. Do not claim real-time vacancy status without verification.

### 5.8 Services directory `/[locale]/services`

Intro:
- VI: `Hỗ trợ phù hợp với từng bước chuẩn bị` / `Bắt đầu bằng tài nguyên miễn phí. Nếu cần hỗ trợ chuyên sâu hơn, hãy xem rõ phạm vi, chi phí và hình thức cung cấp của từng dịch vụ.`
- DE: `Unterstützung für unterschiedliche Vorbereitungsschritte` / `Starte mit kostenlosen Ressourcen. Wenn du mehr Unterstützung benötigst, informiere dich transparent über Umfang, Kosten und Leistungsform.`
- EN: `Support for different stages of preparation` / `Start with free resources. If you need more support, compare the scope, price and delivery format of each service.`

Create individual service pages from the central pricing/service configuration. **No booking/payment CTA unless status is approved and live.**

### 5.9 Pricing `/[locale]/pricing`

**VI:** H1 `Bảng giá rõ ràng, lựa chọn linh hoạt` / Lead `Bạn có thể bắt đầu miễn phí. Các dịch vụ trả phí chỉ được mở khi phạm vi hỗ trợ, điều kiện sử dụng và chính sách liên quan đã được công bố rõ ràng.` / Subheading `Chọn mức hỗ trợ phù hợp` / Fine print `Giá đề xuất; dịch vụ chưa mở bán sẽ được đánh dấu rõ ràng. Không có cam kết visa, vị trí Ausbildung hoặc kết quả tuyển chọn.`

**DE:** H1 `Transparente Preise. Passende Unterstützung.` / Lead `Du kannst kostenlos beginnen. Kostenpflichtige Leistungen werden erst angeboten, wenn Leistungsumfang, Bedingungen und relevante Richtlinien klar veröffentlicht sind.` / Subheading `Wähle die passende Unterstützung` / Fine print `Vorgeschlagene Preise; noch nicht verfügbare Leistungen sind gekennzeichnet. Keine Garantie für Visa, Ausbildungsplätze oder Zusagen.`

**EN:** H1 `Transparent pricing. Support when you need it.` / Lead `You can start for free. Paid services are offered only when their scope, terms and relevant policies are clearly published.` / Subheading `Choose your level of support` / Fine print `Proposed prices; unavailable services are clearly marked. No visa, placement or acceptance guarantees.`

**Pricing configuration — one source of truth** (VND, no invented exchange-rate conversions):

| slug | service | proposed price | unit | initial state | notes |
|---|---|---:|---|---|---|
| explorer | STARTIN-DE Explorer | 0 | free | live if public guides exist | Guides and educational resources |
| basic-document-check | Basic Document Check | 0 | one introductory check | conditional | Only mark live if quota/free tier exists in backend; otherwise show actual current access terms |
| document-check-plus | Document Check Plus | 99000 | per document | proposed_not_live | Detailed automated review, actionable suggestions, downloadable report; must be distinct from free check |
| application-package-review | Application Package Review | 299000 | per package | proposed_not_live | CV + motivation letter + cross-document consistency; only after package workflow exists |
| personal-germany-assessment | Personal Germany Assessment | 490000 | per consultation | proposed_not_live | 45–60 minutes + written roadmap; only if advisors and fulfilment exist |
| application-ready | Application Ready | 3900000 | per package | legal_review_required | CV/letter preparation and human feedback; define exact revision count and delivery time before sale |
| career-preparation | Ausbildung Career Preparation | 7900000 | per programme | legal_review_required | Illustrative 8-week programme; counsel must assess candidate-fee legality |
| arrival-club | Arrival Club | 149000 | per month | proposed_not_live | Community/resources; do not activate recurring billing before service exists |

**Mandatory business logic:**
- `status` values: `live`, `coming_soon`, `proposed_not_live`, `legal_review_required`, `paused`.
- Default all proposed paid services to **not live**. Do not assume previously discussed prices were approved by the owner.
- The existing Document Check Centre may already have a working entitlement/price model; inspect it and do not contradict actual behaviour. The public page should read current product configuration rather than fabricate free quotas.
- For unavailable offers: show `Planned` / `Dự kiến` / `Geplant` and price as `Indicative / Giá tham khảo / Preisvorschlag` **or hide the amount until approved**; make this configurable. Do not put `Buy`, `Pay`, `Subscribe` or `Book now` on unavailable offers.
- For legally sensitive offers: show `Service details under review` and **do not publish a purchase action**. Optionally hide the price entirely until counsel approves.
- Show price unit, what's included, exclusions, revision limit, turnaround, whether AI-only or human-reviewed, refund terms and availability.
- All prices in VND; format for Vietnamese locale, but retain currency label for DE/EN. Do not show EUR equivalents without a maintained exchange-rate policy.
- Taxes, invoices, payment provider, refunds and consumer terms require owner decisions before checkout.
- Separate B2B employer-funded recruitment/placement from candidate-paid services; no candidate-funded placement fees disguised as preparation.

**Localized card names:**

| slug | Vietnamese | German | English |
|---|---|---|---|
| explorer | Khám phá miễn phí | Kostenlos entdecken | Explorer |
| basic-document-check | Kiểm tra hồ sơ cơ bản | Basis-Dokumenten-Check | Basic Document Check |
| document-check-plus | Kiểm tra hồ sơ Plus | Dokumenten-Check Plus | Document Check Plus |
| application-package-review | Kiểm tra bộ hồ sơ | Bewerbungsunterlagen-Paketprüfung | Application Package Review |
| personal-germany-assessment | Tư vấn định hướng cá nhân | Persönliche Deutschland-Beratung | Personal Germany Assessment |
| application-ready | Chuẩn bị hồ sơ ứng tuyển | Bewerbungsunterlagen vorbereiten | Application Ready |
| career-preparation | Chuẩn bị nghề nghiệp Ausbildung | Ausbildungsvorbereitung | Ausbildung Career Preparation |
| arrival-club | Cộng đồng hội nhập | Ankommen-Club | Arrival Club |

**Pricing FAQ topics:** What is free? Is the document checker AI-only? Does paid review include a human? Can I get a refund? Does paying improve my visa or placement chances? How is personal information handled? For anything without an approved policy, display a clear `Details to be published before purchase` message instead of inventing terms.

### 5.10 About `/[locale]/about`

**VI:** H1 `STARTIN-DE là gì?` / Lead `STARTIN-DE được xây dựng để giúp người Việt tìm hiểu con đường học tập, học nghề và phát triển sự nghiệp tại Đức một cách rõ ràng hơn. Chúng tôi tập trung vào thông tin có thể kiểm tra, công cụ chuẩn bị thực tế và cách tư vấn minh bạch.` / Values `Minh bạch`; `Thiết thực`; `Tôn trọng lựa chọn của bạn`.

**DE:** H1 `Was ist STARTIN-DE?` / Lead `STARTIN-DE unterstützt Menschen aus Vietnam dabei, Bildungs-, Ausbildungs- und Berufswege in Deutschland besser zu verstehen. Unser Schwerpunkt liegt auf nachvollziehbaren Informationen, praktischen Vorbereitungshilfen und transparenter Kommunikation.` / Values `Transparenz`; `Praxisnähe`; `Respekt vor individuellen Entscheidungen`.

**EN:** H1 `What is STARTIN-DE?` / Lead `STARTIN-DE helps people in Vietnam better understand education, vocational training and career pathways in Germany. We focus on verifiable information, practical preparation tools and transparent guidance.` / Values `Transparency`; `Practicality`; `Respect for individual choices`.

No invented founder biography, office address, staff photos, partner logos, certifications or registration numbers. Add verified company identity/contact details when owner provides them.

### 5.11 German partners `/[locale]/partners`

This page should appeal primarily to German employers, vocational training providers and institutions. It should be factual and avoid suggesting existing partnerships.

**DE:** H1 `Mit STARTIN-DE Perspektiven verbinden` / Lead `Wir entwickeln eine Plattform, die Interessierte aus Vietnam mit verlässlichen Informationen und praktischer Vorbereitung auf Ausbildungswege in Deutschland unterstützt. Wir freuen uns über den Austausch mit Ausbildungsbetrieben, Bildungseinrichtungen und weiteren seriösen Partnern.` / CTA `Partnerschaft anfragen` / Note `Eine Zusammenarbeit wird erst nach gemeinsamer Prüfung von Zielen, Zuständigkeiten und rechtlichen Rahmenbedingungen vereinbart.`

**VI:** H1 `Hợp tác cùng STARTIN-DE` / Lead `Chúng tôi mong muốn kết nối với doanh nghiệp đào tạo nghề, cơ sở giáo dục và các đối tác uy tín tại Đức để phát triển thông tin và hoạt động chuẩn bị có trách nhiệm.` / CTA `Liên hệ hợp tác`.

**EN:** H1 `Partner with STARTIN-DE` / Lead `We welcome conversations with German training employers, educational institutions and responsible partners interested in transparent information and practical candidate preparation.` / CTA `Discuss a partnership`.

If no contact form backend exists, implement a secure, spam-protected form or use a verified email address supplied by owner. Never invent an email address.

### 5.12 Contact `/[locale]/contact`

**VI:** H1 `Liên hệ STARTIN-DE` / Lead `Bạn có câu hỏi về các công cụ, nội dung hoặc khả năng hợp tác? Hãy gửi lời nhắn và cho chúng tôi biết bạn cần hỗ trợ điều gì.`
**DE:** H1 `Kontakt zu STARTIN-DE` / Lead `Hast du Fragen zu unseren Werkzeugen, Inhalten oder einer möglichen Zusammenarbeit? Schreib uns und teile uns mit, worum es geht.`
**EN:** H1 `Contact STARTIN-DE` / Lead `Have a question about our tools, content or potential partnerships? Send us a message and tell us what you need.`

Form fields: name, email, audience type (candidate/parent/partner/other), message, privacy acknowledgment. Validate, rate-limit and protect against spam. Do not request passport scans or other sensitive documents through the public contact form. Show honest response expectations; no invented 24-hour SLA.

---

## 6. Knowledge Centre and initial article plan

Build a scalable guide system with localized slugs or shared article IDs, language-specific titles/descriptions, category, publication status, source URLs, `lastReviewedAt`, author/reviewer fields only when real, and related-tool CTAs. Content can be Markdown/MDX or existing CMS depending on repo; prefer simple version-controlled content for MVP.

**Initial 12 guides (VI / DE / EN titles):**

1. `Ausbildung tại Đức là gì?` / `Was ist eine Ausbildung in Deutschland?` / `What is Ausbildung in Germany?`
2. `Điều kiện Ausbildung cho ứng viên Việt Nam` / `Ausbildung: Voraussetzungen für Bewerber aus Vietnam` / `Ausbildung requirements for applicants from Vietnam`
3. `Trình độ tiếng Đức cần chuẩn bị` / `Deutschkenntnisse für die Ausbildung` / `German language preparation for Ausbildung`
4. `Lương Ausbildung và chi phí sinh hoạt` / `Ausbildungsvergütung und Lebenshaltungskosten` / `Ausbildung pay and living costs`
5. `Cách tìm vị trí Ausbildung` / `Ausbildungsplätze finden` / `How to find an Ausbildung position`
6. `Cách viết CV tiếng Đức` / `Einen deutschen Lebenslauf schreiben` / `How to write a German CV`
7. `Cách viết thư động lực` / `Ein Anschreiben verfassen` / `How to write a motivation letter`
8. `Chuẩn bị phỏng vấn Ausbildung` / `Auf das Ausbildungsgespräch vorbereiten` / `Prepare for an Ausbildung interview`
9. `Các giấy tờ thường gặp khi ứng tuyển` / `Typische Bewerbungsunterlagen` / `Common application documents`
10. `Hệ thống đào tạo nghề tại Đức` / `Das Berufsbildungssystem in Deutschland` / `Germany's vocational training system`
11. `Nhận biết lời hứa thiếu thực tế` / `Unrealistische Versprechen erkennen` / `Spotting unrealistic promises`
12. `Những tháng đầu tại Đức` / `Die ersten Monate in Deutschland` / `Your first months in Germany`

**Content depth:** Do not generate 12 shallow SEO articles or fabricate legal facts. At minimum, fully write and review the first **four high-priority articles** plus the German CV and motivation letter guides, with meaningful explanations, FAQs and official links. Remaining articles can remain **unpublished** until researched/reviewed. Never publish placeholder articles or link to 404s.

**Editorial standards:**
- Distinguish evergreen explanation from dynamic requirements.
- Link to official sources for visas, training requirements, qualification recognition and employment conditions.
- Include `Last reviewed` date only when genuinely reviewed; do not set it automatically to today on each deploy.
- Avoid unverified fixed B1 requirements, age caps, pay amounts, visa thresholds or guarantees.
- Use actual source URLs and page titles; verify availability when browsing is available. Do not invent citations.
- Cite relevant official sites such as Make it in Germany, Federal Employment Agency, German diplomatic missions, IHK/AHK, and applicable government sources.
- Translate meaning and audience intent, not just words.
- Add relevant internal CTAs: CV guide → Document Check; Ausbildung overview → requirements guide; pricing → services.
- No unreviewed machine-generated immigration/legal advice.

**Useful official starting points for editorial verification:**
- https://www.make-it-in-germany.com/en/
- https://www.arbeitsagentur.de/jobsuche/
- https://www.ihk.de/
- https://vietnam.diplo.de/
- https://vietnam.ahk.de/
- https://www.gesetze-im-internet.de/sgb_3/__296a.html

---

## 7. SEO, metadata and analytics

- Correct localized canonical URLs and `hreflang` for `vi`, `de`, `en`, plus `x-default` where appropriate.
- Unique title and description for each page/locale; no duplicate generic metadata.
- XML sitemap including only published, indexable public pages.
- `robots.txt`; exclude auth, app/private routes, admin, preview and unpublished pages.
- Open Graph/Twitter metadata with actual uploaded approved image assets.
- Structured data where appropriate: `Organization` (only verified identity fields), `WebSite`, `BreadcrumbList`, `Article` for real articles, `FAQPage` only where actual visible FAQ exists and permitted. Do not invent review ratings.
- Proper heading hierarchy, descriptive links, semantic HTML and optimized images.
- Privacy-aware analytics events: hero CTA, pathway card, pricing view, document check entry, sign-in conversion, guide click, partner inquiry. Never send document contents, extracted text, names or emails to analytics.
- Consent/cookie behaviour must match actual analytics provider and relevant legal requirements; do not invent a compliant consent banner without implementing its logic.
- Track funnel: public visitor → tool landing → sign-in → document upload → report viewed; aggregate only.

---

## 8. Conversion and application integration

**Public → authenticated flow:**
1. Visitor learns about Document Check on public page.
2. Clicks `Start document check`.
3. If logged in, go to existing upload section.
4. If logged out, go to existing sign-in/sign-up flow.
5. After successful authentication, safely return to the document upload page.
6. No open redirect vulnerabilities; allow only validated internal destinations.

**Pricing → tool:** Live free check links to tool; proposed Plus services show planned state, not checkout. Do not create duplicate billing logic.

**Existing app:** Preserve current auth callbacks, RLS, document ownership, private storage, AI processing and report routes. Keep public layout separate from authenticated layout. Ensure navigation between app and public site is obvious and accessible.

**Future Path Finder:** Reserve content and architecture but do not create a fake questionnaire. Use an honest planned label until implemented.

**German partner lead:** separate contact intent and optional CRM lead classification; no claim of verified partner network before contracts exist.

---

## 9. Pricing architecture and service model

Create a central typed service catalog such as `src/config/services.ts` or equivalent, with stable IDs and locale content separated from numerical pricing. Avoid copying prices into many components or locale files.

Example schema:

```ts
type ServiceStatus =
  | 'live'
  | 'coming_soon'
  | 'proposed_not_live'
  | 'legal_review_required'
  | 'paused';

type ServiceOffer = {
  id: string;
  priceVnd: number | null;
  billingUnit: 'free' | 'document' | 'package' | 'consultation' | 'programme' | 'month';
  status: ServiceStatus;
  showIndicativePrice: boolean;
  includes: string[]; // stable locale keys, not translated strings
  exclusions: string[];
  humanReviewed: boolean;
  deliveryTime?: string; // only verified commitments
  revisionLimit?: number; // only verified commitments
  checkoutEnabled: boolean;
};
```

**Guardrail:** `checkoutEnabled` must be false whenever status !== `live`; additionally, legally sensitive services require explicit owner approval flag and legal sign-off before live. A public status is not sufficient proof that backend payment entitlements exist.

If payment is later introduced, implement order persistence, payment confirmation webhooks, idempotency, invoice/refund policies, access entitlements and provider security. **Not part of initial public-site build unless existing working payment integration is present and approved.**

---

## 10. Compliance, claims and content review

This project touches cross-border education/employment preparation. Marketing copy must be accurate and avoid misleading claims.

- Never promise visas, Ausbildung placements, recognition, salary, job contracts or acceptance.
- Do not state that STARTIN-DE is licensed or officially partnered without documentation.
- Do not charge candidates for prohibited vocational placement services or disguised placement-related services.
- **German §296a SGB III:** legal counsel must review the actual scope of candidate-paid services, including placement-related preparation and guidance.
- Review Vietnamese legal requirements for overseas employment services, recruitment, advice and worker preparation.
- Review GDPR and Vietnamese personal data requirements, including international transfers and AI subprocessors.
- Public site should describe document checking as preparation feedback, not authenticity verification or qualification recognition.
- Add actual company legal name, registered address, contact information, policies and terms before public commercial launch; if unknown, keep explicit launch-blocking TODOs in an internal checklist rather than fictional public details.
- Have a human review sensitive legal, immigration and pricing translations.

---

## 11. Suggested implementation phases and acceptance tests

### Phase A — public foundation
- Inspect repo and assets.
- Establish i18n route structure and locale dictionaries.
- Public layout/header/footer/mobile nav.
- Design tokens and reusable components.
- Homepage with complete localized copy.
- Existing app/auth regression tests.

**Acceptance:** unauthenticated `/vi`, `/de`, `/en` clearly explain the business; language switch preserves equivalent page where available; mobile nav and CTAs work; existing app still works.

### Phase B — core public pages
- Ausbildung, Study, Work, Tools, Document Check landing, About, Partners, Contact.
- Honest availability states.
- Safe auth handoff to Document Check.
- Images organized from incoming folder.

**Acceptance:** no fake CTA, no unsupported service claim, no broken internal link, no unprotected document upload.

### Phase C — services and pricing
- Central service catalog.
- Services directory, individual service detail templates and pricing page in all three languages.
- Pricing cards with inclusions and availability labels.
- Explicit disabled checkout for non-live offers.

**Acceptance:** changing a proposed price in one config updates all public references; unavailable services cannot be purchased; status and terms are accurate.

### Phase D — knowledge and SEO
- Guide index, article renderer and first six substantive guides (localized).
- Source metadata and review date.
- SEO metadata, canonical/hreflang, sitemap, structured data, Open Graph.
- Privacy-aware analytics events.

**Acceptance:** only published guides appear in sitemap; dynamic claims have credible sources; no placeholder articles or fabricated review dates.

### Phase E — QA and launch preparation
- Visual QA across mobile/tablet/desktop and all three languages.
- Keyboard/accessibility checks.
- Lighthouse performance review and image optimization.
- Auth/documents regression test.
- Contact form spam protection and validation.
- Verify all legal/policy/price status launch blockers.
- Create deployment and editorial maintenance documentation.

**Acceptance:** `lint`, `typecheck`, `test`, `build` pass or failures are clearly reported with causes. Existing private document permissions unchanged. No public page accidentally redirects to sign-in.

---

## 12. Deliverables from Codex

1. Production-oriented public website integrated with existing STARTIN-DE application.
2. Complete localized core UI copy for Vietnamese, German and English.
3. Responsive homepage and all core public pages.
4. Central service/pricing catalog and transparent proposed availability states.
5. Public Document Check landing page with functioning auth handoff.
6. Image organization and optimized usage of owner-supplied assets.
7. Guides architecture and at least six researched, substantive, localized initial guides, or a documented content-review queue where authoritative verification cannot be completed.
8. SEO, metadata, sitemap and appropriate structured data.
9. Contact/partner inquiry workflow (only if a verified delivery destination is configured).
10. Tests, screenshots or visual QA notes, deployment instructions, `.env.example` changes and a clear outstanding-decisions checklist.

**Do not declare production-ready** until legal entity/contact details, privacy/terms, provider data handling, pricing approval and legal review are completed.

---

## 13. Owner decisions / launch blockers

Codex should implement safe defaults and list these questions for the owner rather than block all development:

- Confirm final logo, brand palette and available photographs.
- Confirm company legal name, business address and public contact channel.
- Confirm which Document Check features and quotas are actually live.
- Approve or revise proposed VND prices and what each tier delivers.
- Decide whether indicative prices for unavailable offers should be publicly visible.
- Approve any human-delivered consultation/preparation offer only after operational and legal review.
- Confirm actual refund/cancellation and privacy policies.
- Confirm contact form destination and newsletter consent approach.
- Confirm whether initial site should include a waitlist for planned features.
- Approve factual/legal content after source verification.

---

## 14. Paste this prompt into Codex

> Read `STARTIN-DE-Public-Website-Codex-Master-Spec.md` fully. The repository already contains working sign-in and Document Check Centre functionality. Your job is to build the complete public-facing STARTIN-DE website around it without breaking existing functionality. Inspect the repository and incoming assets first, then implement the specification in phases A–E. Use the supplied Vietnamese/German/English copy, implement central pricing with non-live defaults, organize my uploaded images from `assets/incoming/` into optimized public folders, and preserve the existing logo. Build real pages, not a mockup. Run tests and report any assumptions, legal/policy launch blockers and missing assets. Do not invent business claims, partner relationships or service availability. Begin with a brief repository assessment and Phase A.

---

**End of master specification.**

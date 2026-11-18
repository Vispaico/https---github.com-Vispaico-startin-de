import type { Locale } from './i18n';

export type GuideSource = { title: string; href: string };
export type GuideArticle = {
  slug: string; category: string; readMinutes: number; reviewedOn: string;
  title: Record<Locale, string>; description: Record<Locale, string>;
  sections: Record<Locale, { title: string; paragraphs: string[] }[]>;
  sources: GuideSource[];
};

export const guides: GuideArticle[] = [
  {
    slug: 'what-is-ausbildung', category: 'pathways', readMinutes: 5, reviewedOn: '2026-11-18',
    title: { vi: 'Ausbildung tại Đức là gì?', de: 'Was ist eine Ausbildung in Deutschland?', en: 'What is Ausbildung in Germany?' },
    description: { vi: 'Tìm hiểu khái niệm đào tạo nghề Ausbildung và những điểm khác nhau giữa các hình thức đào tạo.', de: 'Lerne die Grundidee der Ausbildung und die Unterschiede zwischen den Ausbildungsformen kennen.', en: 'Understand the idea of Ausbildung and how the main training formats differ.' },
    sections: {
      vi: [
        { title: 'Đào tạo nghề kết hợp kiến thức và thực hành', paragraphs: ['Ausbildung là cách gọi phổ biến cho đào tạo nghề tại Đức. Tùy chương trình, người học xây dựng kiến thức và kỹ năng nghề qua việc học tại trường, thực hành tại doanh nghiệp hoặc kết hợp cả hai.', 'Vì vậy, khi tìm hiểu một nghề, hãy đọc mô tả của đúng chương trình. Tên gọi giống nhau không có nghĩa mọi nơi có cùng lịch học, nội dung thực hành hoặc điều kiện đầu vào.'] },
        { title: 'Hình thức kép và hình thức tại trường', paragraphs: ['Đào tạo kép (duale Ausbildung) thường luân phiên giữa trường nghề và doanh nghiệp. Đào tạo tại trường nghề (schulische Ausbildung) chủ yếu diễn ra ở cơ sở giáo dục, có thể có giai đoạn thực tập. Một số lĩnh vực và chương trình có cấu trúc riêng.', 'Hình thức đào tạo cũng ảnh hưởng tới nơi học, thời gian biểu và cách xử lý chi phí hoặc phụ cấp. Hãy xác nhận trực tiếp với cơ sở đào tạo và đọc kỹ hợp đồng nếu có.'] },
        { title: 'Ausbildung khác với du học đại học và việc làm', paragraphs: ['Ausbildung tập trung vào năng lực của một nghề cụ thể. Chương trình đại học thường có trọng tâm học thuật khác; công việc có chuyên môn là quan hệ việc làm, không phải khóa đào tạo. Có những chương trình kết hợp học và làm, nhưng đó là loại hình riêng.', 'Việc hiểu đúng mục tiêu giúp bạn chọn nguồn thông tin phù hợp và đặt câu hỏi chính xác cho doanh nghiệp hoặc trường học.'] },
        { title: 'Bắt đầu tìm hiểu như thế nào?', paragraphs: ['Chọn một vài nghề dựa trên nhiệm vụ công việc bạn quan tâm. Tìm trang thông tin chính thức về nghề, nơi đào tạo và yêu cầu tuyển sinh. Sau đó ghi lại bằng cấp, ngôn ngữ, tài liệu, thời hạn và các khoản chi phí cần xác minh.', 'Điều kiện cụ thể thay đổi theo chương trình và hoàn cảnh. Hướng dẫn thị thực, nếu liên quan, cần được kiểm tra riêng với cơ quan có thẩm quyền; bài viết này không đánh giá tư cách thị thực của cá nhân.'] },
      ],
      de: [
        { title: 'Berufliche Bildung mit Theorie und Praxis', paragraphs: ['Ausbildung ist ein verbreiteter Begriff für berufliche Bildung in Deutschland. Je nach Programm entwickelst du Fachwissen und berufliche Fähigkeiten im Unterricht, durch Praxis im Betrieb oder durch eine Kombination aus beidem.', 'Lies deshalb immer die Beschreibung des konkreten Programms. Derselbe Berufsname bedeutet nicht automatisch denselben Ablauf, dieselben Praxisanteile oder identische Zugangsvoraussetzungen.'] },
        { title: 'Duale und schulische Ausbildung', paragraphs: ['Bei einer dualen Ausbildung wechseln sich Unterricht an der Berufsschule und praktische Arbeit im Betrieb häufig ab. Eine schulische Ausbildung findet überwiegend an einer Bildungseinrichtung statt und kann praktische Phasen umfassen. Für manche Berufe gibt es besondere Modelle.', 'Die Ausbildungsform beeinflusst Lernorte, Zeitplan und mögliche Kosten oder Vergütungen. Erkundige dich direkt bei der Bildungseinrichtung und lies einen möglichen Vertrag sorgfältig.'] },
        { title: 'Ausbildung, Studium und Beschäftigung', paragraphs: ['Eine Ausbildung vermittelt Fähigkeiten für einen konkreten Beruf. Ein Hochschulstudium hat einen anderen akademischen Schwerpunkt; eine qualifizierte Beschäftigung ist ein Arbeitsverhältnis und kein Ausbildungsprogramm. Es gibt kombinierte Modelle, sie sind jedoch eigene Programmformen.', 'Wenn du den Unterschied kennst, findest du passendere offizielle Informationen und kannst gezieltere Fragen stellen.'] },
        { title: 'Wie kannst du anfangen?', paragraphs: ['Wähle einige Berufe anhand der Tätigkeiten aus, die dich interessieren. Suche offizielle Informationen zum Beruf, zum Lernort und zu den Zugangsvoraussetzungen. Notiere anschließend Abschlüsse, Sprache, Unterlagen, Fristen und mögliche Kosten, die du noch prüfen musst.', 'Konkrete Voraussetzungen hängen vom Programm und deiner Situation ab. Visainformationen musst du bei Bedarf gesondert bei den zuständigen Stellen prüfen; dieser Ratgeber beurteilt keine individuelle Visumberechtigung.'] },
      ],
      en: [
        { title: 'Vocational learning combines knowledge and practice', paragraphs: ['Ausbildung is a commonly used term for vocational training in Germany. Depending on the programme, learners build occupation-specific knowledge and skills through classes, practical work at a company or a combination of both.', 'Always read the description of the specific programme. The same occupation name does not guarantee the same schedule, practical content or entry requirements.'] },
        { title: 'Dual and school-based training', paragraphs: ['Dual Ausbildung commonly alternates between vocational school and practical training at an employer. School-based programmes take place mainly at a vocational school and may include practical placements. Some occupations have their own structures.', 'The format affects where you learn, your schedule and how costs or allowances may work. Confirm details with the provider and read any contract carefully.'] },
        { title: 'Ausbildung, university study and employment', paragraphs: ['Ausbildung develops skills for a specific occupation. University study has a different academic focus; skilled employment is an employment relationship rather than a training programme. Some programmes combine study and work, but these are distinct formats.', 'Understanding the difference helps you find the right official information and ask more relevant questions.'] },
        { title: 'Where to begin', paragraphs: ['Shortlist occupations by the tasks that interest you. Find official information about each occupation, training provider and entry criteria. Then record the qualifications, language, documents, deadlines and costs you still need to verify.', 'Requirements depend on the programme and your circumstances. Check visa guidance separately with the responsible authorities where relevant; this guide does not assess anyone’s visa eligibility.'] },
      ],
    },
    sources: [
      { title: 'Vocational Training in Germany — Make it in Germany', href: 'https://www.make-it-in-germany.com/en/study-vocational-training/training-in-germany' },
      { title: 'What is vocational training? — Make it in Germany', href: 'https://www.make-it-in-germany.com/en/study-vocational-training/training-in-germany/what-is-it' },
    ],
  },
  {
    slug: 'ausbildung-requirements', category: 'pathways', readMinutes: 6, reviewedOn: '2026-11-18',
    title: { vi: 'Điều kiện Ausbildung cho ứng viên Việt Nam', de: 'Ausbildung: Voraussetzungen für Bewerber aus Vietnam', en: 'Ausbildung requirements for applicants from Vietnam' },
    description: { vi: 'Các nhóm điều kiện cần tìm hiểu: bằng cấp, ngôn ngữ, nơi đào tạo, hồ sơ và quy định áp dụng cho hoàn cảnh cụ thể.', de: 'Diese Bereiche solltest du prüfen: Schulabschluss, Sprache, Ausbildungsort, Unterlagen und individuelle Regeln.', en: 'What to check: school qualifications, language, training provider, documents and rules for your situation.' },
    sections: {
      vi: [
        { title: 'Bắt đầu từ chương trình và nghề cụ thể', paragraphs: ['Không có một danh sách điều kiện duy nhất cho mọi nghề Ausbildung. Doanh nghiệp, trường nghề và cơ quan có thẩm quyền có thể xét các yêu cầu khác nhau. Hãy xem trang tuyển sinh hoặc tin tuyển dụng gốc để biết điều kiện của nơi bạn muốn nộp.', 'Bạn có thể lập bảng gồm nghề, địa điểm, bằng cấp yêu cầu, ngôn ngữ, giấy tờ và hạn nộp. Ghi kèm đường dẫn và ngày kiểm tra để dễ cập nhật.'] },
        { title: 'Bằng cấp học tập', paragraphs: ['Yêu cầu về bằng cấp phụ thuộc vào hình thức đào tạo và nghề. Một số doanh nghiệp đặt tiêu chí học vấn riêng; chương trình tại trường có thể yêu cầu bằng cấp phổ thông hoặc xác minh tương đương. Chương trình kết hợp học đại học có thể có điều kiện đầu vào đại học.', 'Đừng tự kết luận bằng cấp của mình tương đương chỉ dựa trên tên gọi. Hỏi trường hoặc cơ quan có thẩm quyền về tài liệu, bản dịch và thủ tục công nhận có áp dụng cho hồ sơ cụ thể hay không.'] },
        { title: 'Ngôn ngữ, hồ sơ và quy định cư trú', paragraphs: ['Năng lực tiếng Đức có thể được doanh nghiệp, trường nghề hoặc quy trình cư trú đánh giá theo cách khác nhau. Mức cần thiết phụ thuộc chương trình và công việc; yêu cầu thị thực hiện hành phải kiểm tra tại nguồn chính thức.', 'Hồ sơ thường bắt đầu bằng CV và thư ứng tuyển, kèm chứng chỉ học tập hoặc giấy tờ khác nếu tin tuyển dụng yêu cầu. Không gửi bản gốc hoặc thông tin nhạy cảm trước khi xác minh người nhận và quy trình.'] },
        { title: 'Danh sách kiểm tra thực tế', paragraphs: ['Trước khi nộp: lưu bản sao tin tuyển dụng; xác minh doanh nghiệp hoặc trường; ghi hạn nộp; hỏi về nội dung đào tạo và hợp đồng; xác định cơ quan chịu trách nhiệm cho các câu hỏi về cư trú hoặc công nhận.', 'Nguồn chính thức có thể thay đổi theo thời điểm. Bài viết này cung cấp khung tìm hiểu, không xác nhận bạn đủ điều kiện tuyển sinh hay thị thực.'] },
      ],
      de: [
        { title: 'Mit einem konkreten Beruf und Programm beginnen', paragraphs: ['Es gibt keine einzige Liste mit Voraussetzungen für alle Ausbildungsberufe. Betriebe, Schulen und Behörden können unterschiedliche Kriterien prüfen. Lies die ursprüngliche Ausschreibung oder die Zulassungsinformationen der gewünschten Einrichtung.', 'Eine Übersicht mit Beruf, Ort, Abschluss, Sprache, Unterlagen und Frist hilft beim Vergleich. Ergänze den Link zur Quelle und das Datum deiner Prüfung.'] },
        { title: 'Schulabschluss', paragraphs: ['Die Anforderungen an den Schulabschluss hängen von Ausbildungsform und Beruf ab. Manche Betriebe legen eigene Kriterien fest; schulische Programme können einen bestimmten Abschluss oder einen Gleichwertigkeitsnachweis verlangen. Ein duales Studium kann eine Hochschulzugangsberechtigung voraussetzen.', 'Leite eine Gleichwertigkeit nicht allein aus der Bezeichnung deines Abschlusses ab. Frage die Schule oder zuständige Stelle, welche Nachweise, Übersetzungen oder Anerkennungsverfahren für deinen konkreten Fall gelten.'] },
        { title: 'Sprache, Unterlagen und Aufenthalt', paragraphs: ['Betriebe, Berufsschulen und aufenthaltsrechtliche Verfahren können Sprachkenntnisse unterschiedlich bewerten. Das erforderliche Niveau hängt vom Programm und Beruf ab; aktuelle Visaanforderungen musst du bei offiziellen Stellen prüfen.', 'Zu den Bewerbungsunterlagen gehören häufig Lebenslauf und Anschreiben sowie Zeugnisse, wenn die Ausschreibung sie verlangt. Sende keine Originale oder sensiblen Informationen, bevor Empfänger und Verfahren geklärt sind.'] },
        { title: 'Praktische Prüfliste', paragraphs: ['Vor der Bewerbung: ursprüngliche Anzeige speichern; Betrieb oder Schule prüfen; Frist notieren; Fragen zu Ausbildungsinhalten und Vertrag sammeln; zuständige Stellen für Aufenthalt oder Anerkennung identifizieren.', 'Offizielle Informationen können sich ändern. Dieser Ratgeber ist eine Recherchehilfe und bestätigt weder eine Zulassung noch eine Visumberechtigung.'] },
      ],
      en: [
        { title: 'Start with a specific occupation and programme', paragraphs: ['There is no single set of requirements for every Ausbildung. Employers, schools and authorities may assess different criteria. Check the original vacancy or admissions information for the provider you are considering.', 'A comparison sheet can capture occupation, location, qualifications, language, documents and deadline. Record the source link and the date you checked it.'] },
        { title: 'School qualifications', paragraphs: ['School qualification requirements depend on the training format and occupation. Some employers set their own education criteria; school-based programmes may require a school-leaving qualification or evidence of equivalence. A dual study programme may require university entrance qualifications.', 'Do not infer equivalence from the name of a certificate alone. Ask the provider or responsible authority which evidence, translations or recognition process applies to your case.'] },
        { title: 'Language, documents and residence rules', paragraphs: ['Employers, vocational schools and residence procedures may assess language skills differently. The level needed depends on the programme and occupation; check current visa requirements through official sources.', 'Applications often begin with a CV and application letter, with education certificates or other records when requested by the listing. Do not send originals or sensitive information before checking the recipient and process.'] },
        { title: 'A practical checklist', paragraphs: ['Before applying: save the original listing; verify the employer or school; note the deadline; prepare questions about the training and contract; identify the authority responsible for residence or recognition questions.', 'Official information can change. This guide provides a research framework and does not confirm admission or visa eligibility.'] },
      ],
    },
    sources: [
      { title: 'Requirements for vocational training — Make it in Germany', href: 'https://www.make-it-in-germany.com/en/study-vocational-training/training-in-germany/requirements' },
      { title: 'Visa for vocational training — Make it in Germany', href: 'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/training' },
    ],
  },
  {
    slug: 'german-language-ausbildung', category: 'preparation', readMinutes: 5, reviewedOn: '2026-11-18',
    title: { vi: 'Trình độ tiếng Đức cần chuẩn bị', de: 'Deutschkenntnisse für die Ausbildung', en: 'German language preparation for Ausbildung' },
    description: { vi: 'Cách xác định yêu cầu ngôn ngữ theo nghề, cơ sở đào tạo và quy trình hồ sơ mà không áp dụng một mức chung cho tất cả.', de: 'So prüfst du Sprachanforderungen je nach Beruf, Einrichtung und Verfahren, ohne ein Niveau pauschal anzunehmen.', en: 'How to check language expectations for an occupation, provider and process without assuming one level fits all.' },
    sections: {
      vi: [
        { title: 'Yêu cầu tiếng Đức đến từ nhiều nơi', paragraphs: ['Doanh nghiệp, trường nghề và cơ quan xử lý cư trú có thể đặt hoặc áp dụng yêu cầu ngôn ngữ khác nhau. Công việc cần giao tiếp với khách hàng hoặc học lý thuyết bằng tiếng Đức có thể đòi hỏi năng lực khác với một công việc khác.', 'Vì vậy, hãy xem tiêu chí trong tin tuyển dụng, hỏi trực tiếp cơ sở đào tạo và kiểm tra hướng dẫn chính thức cho thủ tục liên quan đến bạn.'] },
        { title: 'Phân biệt điều kiện tuyển sinh và điều kiện thị thực', paragraphs: ['Một nơi đào tạo có thể đánh giá năng lực tiếng Đức của ứng viên; quy trình thị thực lại có những hướng dẫn riêng. Hai bên có thể yêu cầu tài liệu hoặc cách chứng minh khác nhau.', 'Trang chính thức Make it in Germany hiện nêu mức B1 là thông thường trong một số trường hợp xin thị thực đào tạo nghề, nhưng cũng mô tả điều kiện áp dụng và ngoại lệ. Không dùng thông tin này thay cho kiểm tra hồ sơ cá nhân hoặc quy định mới nhất.'] },
        { title: 'Lập kế hoạch học tập có thể kiểm tra', paragraphs: ['Chia mục tiêu thành nghe, nói, đọc và viết; lưu lại chứng chỉ được chương trình chấp nhận; ghi mốc thời gian và ngày hết hạn nếu có. Tập trung vào tình huống nghề nghiệp như hiểu hướng dẫn, trao đổi với đồng nghiệp và đặt câu hỏi.', 'Đừng mua khóa học chỉ vì lời hứa “đủ trình độ” hoặc bảo đảm thị thực. Xác minh chương trình, tổ chức thi và điều kiện của nơi đào tạo trước khi thanh toán.'] },
      ],
      de: [
        { title: 'Sprachanforderungen kommen aus verschiedenen Bereichen', paragraphs: ['Betriebe, Berufsschulen und Stellen für Aufenthaltsverfahren können unterschiedliche Sprachanforderungen stellen. Tätigkeiten mit Kundenkontakt oder Unterricht auf Deutsch können andere Fähigkeiten voraussetzen als andere Berufe.', 'Prüfe daher die Ausschreibung, frage die Bildungseinrichtung und lies die offiziellen Informationen zum für dich relevanten Verfahren.'] },
        { title: 'Zugang zur Ausbildung und Visum unterscheiden', paragraphs: ['Ein Ausbildungsbetrieb kann deine Deutschkenntnisse beurteilen; ein Visaverfahren folgt eigenen Vorgaben. Die Stellen können unterschiedliche Nachweise oder Formen des Sprachnachweises verlangen.', 'Die offizielle Seite Make it in Germany nennt B1 derzeit als übliches Niveau in bestimmten Fällen eines Visums zur Berufsausbildung und beschreibt zugleich den Anwendungsbereich und Ausnahmen. Das ersetzt keine individuelle Prüfung oder aktuelle Behördenauskunft.'] },
        { title: 'Lernen nachvollziehbar planen', paragraphs: ['Teile dein Ziel in Hören, Sprechen, Lesen und Schreiben auf. Notiere, welche Zertifikate der konkrete Anbieter akzeptiert, welche Fristen gelten und ob Nachweise ein Ablaufdatum haben. Übe auch berufliche Situationen wie Anweisungen verstehen und Rückfragen stellen.', 'Verlasse dich nicht auf Versprechen wie „garantiert visumfähig“. Prüfe Kursanbieter, Prüfungsstelle und Anforderungen der Ausbildung, bevor du bezahlst.'] },
      ],
      en: [
        { title: 'Language expectations come from different places', paragraphs: ['Employers, vocational schools and residence authorities may set or apply different language expectations. Roles involving customers or German-language instruction may call for different skills from other occupations.', 'Check the vacancy, ask the training provider and review official guidance for the process relevant to you.'] },
        { title: 'Separate training admission from visa requirements', paragraphs: ['A training provider may assess your German skills, while a visa procedure has its own rules. The two may require different evidence or ways of demonstrating language proficiency.', 'The official Make it in Germany page currently describes B1 as the usual level in certain vocational-training visa cases, while also explaining the scope and exceptions. This does not replace an individual assessment or the latest authority guidance.'] },
        { title: 'Plan learning you can track', paragraphs: ['Break your goal into listening, speaking, reading and writing. Record which certificates the specific provider accepts, relevant deadlines and any validity periods. Practise workplace situations such as understanding instructions and asking questions.', 'Be cautious of claims such as “guaranteed visa level”. Verify the course, examination provider and training requirements before paying.'] },
      ],
    },
    sources: [
      { title: 'Visa for vocational training — Make it in Germany', href: 'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/training' },
      { title: 'German language skills required for visas — Make it in Germany (PDF)', href: 'https://www.make-it-in-germany.com/fileadmin/1_Rebrush_2022/a_Fachkraefte/PDF-Dateien/3_Visa_u_Aufenthalt/Visagrafik_EN/2024_Visum_erforderliche_Deutschkenntnisse_EN.pdf' },
    ],
  },
  {
    slug: 'ausbildung-pay-and-living-costs', category: 'planning', readMinutes: 5, reviewedOn: '2026-11-18',
    title: { vi: 'Lương Ausbildung và chi phí sinh hoạt', de: 'Ausbildungsvergütung und Lebenshaltungskosten', en: 'Ausbildung pay and living costs' },
    description: { vi: 'Những điểm cần đối chiếu khi lập kế hoạch tài chính: hình thức đào tạo, hợp đồng, nơi ở và các quy định hiện hành.', de: 'Wichtige Punkte für deine Finanzplanung: Ausbildungsform, Vertrag, Wohnort und aktuelle Anforderungen.', en: 'What to compare when planning finances: training format, contract, accommodation and current requirements.' },
    sections: {
      vi: [
        { title: 'Không phải chương trình nào cũng có cùng mức trả', paragraphs: ['Đào tạo kép tại doanh nghiệp thường có phụ cấp đào tạo được quy định trong hợp đồng. Đào tạo tại trường nghề có thể không có khoản trả cố định và cấu trúc chi phí phụ thuộc loại cơ sở, ngành nghề và chương trình.', 'Không dùng một con số quảng cáo để suy ra thu nhập thực nhận. Hãy hỏi khoản phụ cấp theo từng năm đào tạo, khoản khấu trừ, giờ làm và các phúc lợi ghi trong hợp đồng.'] },
        { title: 'Lập ngân sách theo thành phố và hoàn cảnh', paragraphs: ['Ngân sách cá nhân có thể gồm tiền thuê nhà, đặt cọc, ăn uống, đi lại, bảo hiểm, điện thoại, học liệu và chi phí ban đầu. Chi phí thực tế thay đổi theo nơi ở, cách thuê nhà và tình hình cá nhân.', 'So sánh một vài lựa chọn nhà ở và dự phòng khoản khẩn cấp. Không coi tiền phụ cấp ghi trong quảng cáo là đủ để trang trải mọi chi phí.'] },
        { title: 'Kiểm tra hướng dẫn tài chính chính thức', paragraphs: ['Nếu cần thị thực, yêu cầu chứng minh tài chính có thể thay đổi theo chương trình và thời điểm. Dùng trang chính thức của cơ quan có thẩm quyền và kiểm tra ngày cập nhật; không dựa vào bảng tính cũ hoặc bài đăng trên mạng xã hội.', 'Bài viết này không đưa ra ngưỡng tài chính hoặc lời khuyên thị thực. Công cụ dự toán chi phí của STARTIN-DE vẫn đang được phát triển.'] },
      ],
      de: [
        { title: 'Nicht jede Ausbildung wird gleich vergütet', paragraphs: ['Bei einer dualen betrieblichen Ausbildung ist häufig eine Vergütung im Vertrag vorgesehen. Schulische Ausbildungen können ohne feste Vergütung stattfinden; die Kostenstruktur hängt von Einrichtung, Beruf und Programm ab.', 'Leite dein Nettoeinkommen nicht aus einer Werbezahl ab. Frage nach der Vergütung in jedem Ausbildungsjahr, Abzügen, Arbeitszeiten und den im Vertrag genannten Leistungen.'] },
        { title: 'Ein Budget für Ort und Situation erstellen', paragraphs: ['Mögliche Ausgaben sind Miete, Kaution, Lebensmittel, Verkehr, Versicherung, Telefon, Lernmaterial und anfängliche Anschaffungen. Die tatsächlichen Kosten unterscheiden sich nach Wohnort, Wohnform und persönlicher Situation.', 'Vergleiche mehrere Wohnoptionen und plane eine Reserve ein. Eine Vergütung aus einer Anzeige deckt nicht automatisch alle Kosten.'] },
        { title: 'Offizielle finanzielle Hinweise prüfen', paragraphs: ['Wenn ein Visum erforderlich ist, können Nachweise zum Lebensunterhalt je nach Programm und Zeitpunkt variieren. Nutze die offiziellen Informationen der zuständigen Behörde und prüfe den Stand; verlasse dich nicht auf alte Tabellen oder soziale Medien.', 'Dieser Beitrag nennt keine finanziellen Schwellenwerte und bietet keine Visaberatung. Der STARTIN-DE-Kostenplaner befindet sich noch in Entwicklung.'] },
      ],
      en: [
        { title: 'Pay differs across programmes', paragraphs: ['Dual company-based training commonly includes an allowance set out in a contract. School-based programmes may not provide a fixed allowance, and their costs depend on the provider, occupation and programme.', 'Do not infer take-home pay from a promotional figure. Ask about the allowance for each training year, deductions, hours and any benefits stated in the contract.'] },
        { title: 'Build a budget around the location and your situation', paragraphs: ['Potential expenses include rent, a deposit, food, transport, insurance, phone, learning materials and initial purchases. Actual costs vary with location, housing arrangements and personal circumstances.', 'Compare a few accommodation options and keep a contingency reserve. An allowance listed in an advertisement does not automatically cover every cost.'] },
        { title: 'Check official financial guidance', paragraphs: ['If a visa is needed, evidence of living costs may vary by programme and time. Use current official information from the responsible authority and check when it was updated; do not rely on an old spreadsheet or social media post.', 'This article does not state a financial threshold or provide visa advice. The STARTIN-DE Cost Planner is still in development.'] },
      ],
    },
    sources: [
      { title: 'Vocational Training in Germany — Make it in Germany', href: 'https://www.make-it-in-germany.com/en/study-vocational-training/training-in-germany' },
      { title: 'Visa for vocational training — Make it in Germany', href: 'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/training' },
    ],
  },
  {
    slug: 'write-a-german-cv', category: 'applications', readMinutes: 6, reviewedOn: '2026-11-18',
    title: { vi: 'Cách viết CV tiếng Đức', de: 'Einen deutschen Lebenslauf schreiben', en: 'How to write a German CV' },
    description: { vi: 'Một quy trình thực tế để tạo CV rõ ràng, có thể điều chỉnh theo từng vị trí Ausbildung.', de: 'Ein praktischer Weg zu einem übersichtlichen Lebenslauf, den du auf jede Ausbildungsstelle abstimmen kannst.', en: 'A practical process for a clear CV that you can tailor to each Ausbildung application.' },
    sections: {
      vi: [
        { title: 'Bắt đầu từ yêu cầu trong tin tuyển dụng', paragraphs: ['Đọc tin tuyển dụng và ghi lại nhiệm vụ, kỹ năng và giấy tờ được yêu cầu. CV nên giúp người đọc nhanh chóng hiểu quá trình học tập, kinh nghiệm và năng lực liên quan của bạn.', 'Cơ quan Việc làm Liên bang Đức khuyến nghị trình bày dạng bảng, theo trình tự thời gian đảo ngược và thường không quá hai trang. Đây là hướng dẫn chung; hãy làm theo yêu cầu cụ thể của doanh nghiệp.'] },
        { title: 'Sắp xếp thông tin dễ quét', paragraphs: ['Dùng tiêu đề rõ như học vấn, kinh nghiệm, thực tập, kỹ năng và ngôn ngữ. Đưa mục mới nhất lên trước, ghi thời gian nhất quán và mô tả nhiệm vụ bằng câu ngắn, cụ thể.', 'Nêu hoạt động tình nguyện hoặc dự án nếu chúng giúp giải thích kỹ năng liên quan. Tránh liệt kê kỹ năng chung chung mà không có ví dụ. Không thêm thông tin cá nhân không cần thiết.'] },
        { title: 'Điều chỉnh và kiểm tra', paragraphs: ['Điều chỉnh thứ tự nội dung và cách mô tả cho từng vị trí, nhưng giữ mọi thông tin đúng sự thật. Kiểm tra chính tả tiếng Đức, định dạng ngày tháng, liên kết và tên tệp.', 'Ảnh ứng tuyển không phải lúc nào cũng bắt buộc. Chỉ đưa ảnh hoặc dữ liệu cá nhân khi bạn muốn và khi phù hợp với yêu cầu cụ thể.'] },
      ],
      de: [
        { title: 'Mit der Ausschreibung beginnen', paragraphs: ['Lies die Stellenanzeige und notiere Aufgaben, gewünschte Fähigkeiten und verlangte Unterlagen. Dein Lebenslauf sollte schnell zeigen, welchen Bildungs- und Berufsweg du genommen hast und welche Erfahrungen relevant sind.', 'Die Bundesagentur für Arbeit empfiehlt eine tabellarische, umgekehrt chronologische Darstellung und nennt häufig höchstens zwei Seiten als Orientierung. Beachte immer die konkreten Hinweise des Betriebs.'] },
        { title: 'Informationen übersichtlich ordnen', paragraphs: ['Nutze klare Abschnitte wie Bildung, Berufserfahrung, Praktika, Kenntnisse und Sprachen. Beginne mit dem aktuellsten Eintrag, halte Datumsangaben einheitlich und beschreibe Aufgaben knapp und konkret.', 'Ehrenamt oder Projekte kannst du aufnehmen, wenn sie relevante Fähigkeiten zeigen. Vermeide allgemeine Aussagen ohne Beispiel und unnötige persönliche Angaben.'] },
        { title: 'Anpassen und prüfen', paragraphs: ['Passe Reihenfolge und Beschreibung an die jeweilige Stelle an, ohne Angaben zu erfinden. Prüfe deutsche Rechtschreibung, Datumsformate, Links und Dateinamen.', 'Ein Bewerbungsfoto ist nicht immer erforderlich. Füge ein Foto oder persönliche Angaben nur hinzu, wenn du das möchtest und es zur konkreten Bewerbung passt.'] },
      ],
      en: [
        { title: 'Start with the vacancy requirements', paragraphs: ['Read the vacancy and note its tasks, desired skills and requested documents. Your CV should help the reader quickly understand your education, experience and relevant abilities.', 'Germany’s Federal Employment Agency recommends a tabular, reverse-chronological format and often uses two pages as a general guide. Follow the specific employer’s instructions first.'] },
        { title: 'Make the information easy to scan', paragraphs: ['Use clear sections such as education, work experience, placements, skills and languages. Put the most recent entry first, use dates consistently and describe tasks in short, specific phrases.', 'Include volunteering or projects when they demonstrate relevant skills. Avoid generic claims without examples and unnecessary personal details.'] },
        { title: 'Tailor and proofread', paragraphs: ['Adjust the order and descriptions for each role while keeping every statement accurate. Check German spelling, date formats, links and the file name.', 'An application photo is not always required. Include a photo or personal details only if you choose to and they fit the specific application instructions.'] },
      ],
    },
    sources: [
      { title: 'Den perfekten Lebenslauf erstellen — Bundesagentur für Arbeit', href: 'https://web.arbeitsagentur.de/bildung/bewerbung/lebenslauf' },
      { title: 'Bewerbungsunterlagen: Das gehört rein — Bundesagentur für Arbeit', href: 'https://web.arbeitsagentur.de/bildung/bewerbung/bewerbungsunterlagen' },
    ],
  },
  {
    slug: 'write-a-motivation-letter', category: 'applications', readMinutes: 6, reviewedOn: '2026-11-18',
    title: { vi: 'Cách viết thư động lực', de: 'Ein Anschreiben verfassen', en: 'How to write a motivation letter' },
    description: { vi: 'Cách kết nối lý do ứng tuyển với yêu cầu của vị trí mà không sao chép mẫu hoặc phóng đại kinh nghiệm.', de: 'So verbindest du deine Motivation mit der Stelle, ohne Vorlagen zu kopieren oder Erfahrungen zu übertreiben.', en: 'Connect your motivation to a specific role without copying templates or overstating experience.' },
    sections: {
      vi: [
        { title: 'Trước tiên, xác định đúng loại thư', paragraphs: ['Một số doanh nghiệp yêu cầu Anschreiben (thư ứng tuyển); một số nơi yêu cầu Motivationsschreiben riêng; nơi khác chỉ cần CV hoặc biểu mẫu trực tuyến. Đọc danh sách tài liệu trước để không gửi thừa hoặc thiếu.', 'Trong thư ứng tuyển, mục tiêu là giải thích vì sao bạn quan tâm đến vị trí và kinh nghiệm hoặc năng lực nào liên quan. Hãy lấy thông tin từ tin tuyển dụng và trang chính thức của doanh nghiệp.'] },
        { title: 'Viết bằng ví dụ cụ thể', paragraphs: ['Chọn một hoặc hai yêu cầu của vị trí và liên kết chúng với trải nghiệm thật: môn học, dự án, việc làm thêm, thực tập hoặc hoạt động phù hợp. Nêu bạn đã làm gì và học được gì, thay vì chỉ nói “tôi chăm chỉ” hoặc “tôi phù hợp”.', 'Giải thích vì sao bạn quan tâm đến nghề và chương trình cụ thể. Tránh lời mở đầu khuôn mẫu, câu văn dài hoặc tuyên bố không thể chứng minh.'] },
        { title: 'Giữ thư ngắn gọn và cá nhân hóa', paragraphs: ['Theo hướng dẫn của Cơ quan Việc làm Liên bang Đức, Anschreiben nên phù hợp với vị trí và thể hiện mối liên hệ giữa yêu cầu của nơi tuyển dụng với năng lực của bạn. Không dùng cùng một bức thư cho mọi doanh nghiệp.', 'Kiểm tra tên người nhận, tên nghề, chính tả, cách xưng hô và tài liệu đính kèm. Nếu tin tuyển dụng yêu cầu một dạng thư khác, hãy làm theo yêu cầu đó.'] },
      ],
      de: [
        { title: 'Zuerst die Art des Schreibens klären', paragraphs: ['Manche Betriebe wünschen ein Anschreiben, andere ein separates Motivationsschreiben; manche verlangen zunächst nur einen Lebenslauf oder ein Onlineformular. Prüfe die Liste der benötigten Unterlagen, bevor du etwas versendest.', 'Im Anschreiben erklärst du, warum dich die Stelle interessiert und welche Erfahrungen oder Fähigkeiten dazu passen. Nutze dafür die Ausschreibung und offizielle Informationen des Betriebs.'] },
        { title: 'Mit konkreten Beispielen schreiben', paragraphs: ['Wähle ein oder zwei Anforderungen der Stelle und verbinde sie mit einer echten Erfahrung: Unterricht, Projekt, Nebenjob, Praktikum oder passendem Engagement. Beschreibe, was du getan und gelernt hast, statt nur Eigenschaften aufzuzählen.', 'Erkläre, warum dich genau dieser Beruf und diese Ausbildung interessieren. Vermeide Floskeln, überlange Sätze und Aussagen, die du nicht belegen kannst.'] },
        { title: 'Kurz und individuell bleiben', paragraphs: ['Die Bundesagentur für Arbeit empfiehlt, das Anschreiben auf die Stelle zuzuschneiden und eine Verbindung zwischen Anforderungen und eigenen Fähigkeiten herzustellen. Verwende nicht dasselbe Schreiben für jeden Betrieb.', 'Prüfe Ansprechperson, Berufsbezeichnung, Rechtschreibung, Anrede und Anlagen. Wenn die Ausschreibung eine andere Textform verlangt, folge dieser Vorgabe.'] },
      ],
      en: [
        { title: 'First identify which type of letter is needed', paragraphs: ['Some employers ask for an Anschreiben (application letter), some request a separate motivation letter, and others initially need only a CV or online form. Check the document list before sending anything.', 'An application letter explains why you are interested in the role and which experience or skills are relevant. Use the vacancy and the employer’s official information as your starting point.'] },
        { title: 'Write with specific examples', paragraphs: ['Choose one or two requirements and connect them to a real experience: a class, project, part-time job, placement or relevant activity. Explain what you did and learned instead of listing traits such as “hard-working” without evidence.', 'Say why this occupation and programme interest you. Avoid stock openings, long sentences and claims you cannot support.'] },
        { title: 'Keep it concise and tailored', paragraphs: ['Germany’s Federal Employment Agency advises tailoring an application letter to the role and showing how your skills connect to the employer’s requirements. Do not send the same letter to every employer.', 'Check the recipient’s name, occupation, spelling, greeting and attachments. Follow the vacancy’s instructions if it asks for a different format.'] },
      ],
    },
    sources: [
      { title: 'Das perfekte Anschreiben erstellen — Bundesagentur für Arbeit', href: 'https://web.arbeitsagentur.de/bildung/bewerbung/anschreiben' },
      { title: 'Bewerbungsunterlagen: Das gehört rein — Bundesagentur für Arbeit', href: 'https://web.arbeitsagentur.de/bildung/bewerbung/bewerbungsunterlagen' },
    ],
  },
];

export function getGuide(slug: string) { return guides.find((item) => item.slug === slug); }

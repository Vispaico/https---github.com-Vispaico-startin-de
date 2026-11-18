import type { Locale } from './i18n';

export const pricingContent: Record<Locale, {
  title: string; lead: string; subheading: string; finePrint: string;
  serviceIntroTitle: string; serviceIntro: string;
  availability: Record<'live' | 'coming_soon' | 'proposed_not_live' | 'legal_review_required' | 'paused', string>;
  unit: Record<string, string>; faq: { title: string; body: string }[];
}> = {
  vi: {
    title: 'Bảng giá rõ ràng, lựa chọn linh hoạt', lead: 'Bạn có thể bắt đầu miễn phí. Các dịch vụ trả phí chỉ được mở khi phạm vi hỗ trợ, điều kiện sử dụng và chính sách liên quan đã được công bố rõ ràng.', subheading: 'Chọn mức hỗ trợ phù hợp', finePrint: 'Giá đề xuất; dịch vụ chưa mở bán sẽ được đánh dấu rõ ràng. Không có cam kết visa, vị trí Ausbildung hoặc kết quả tuyển chọn.',
    serviceIntroTitle: 'Hỗ trợ phù hợp với từng bước chuẩn bị', serviceIntro: 'Bắt đầu bằng tài nguyên miễn phí. Nếu cần hỗ trợ chuyên sâu hơn, hãy xem rõ phạm vi, chi phí và hình thức cung cấp của từng dịch vụ.',
    availability: { live: 'Đang hoạt động', coming_soon: 'Sắp ra mắt', proposed_not_live: 'Dự kiến · chưa mở bán', legal_review_required: 'Cần rà soát pháp lý', paused: 'Tạm dừng' },
    unit: { free: 'miễn phí', document: 'mỗi tài liệu', package: 'mỗi bộ hồ sơ', consultation: 'mỗi buổi dự kiến', programme: 'mỗi chương trình dự kiến', month: 'mỗi tháng dự kiến' },
    faq: [
      { title: 'Hiện có nội dung nào miễn phí?', body: 'Các cẩm nang công khai và thông tin trên website được đọc miễn phí. Công cụ kiểm tra hồ sơ hiện có trong khu vực tài khoản; giới hạn sử dụng theo cấu hình hiện tại.' },
      { title: 'Công cụ kiểm tra hồ sơ có người xem không?', body: 'Không mặc định. Quy trình hiện có sử dụng phân tích tự động khi nhà cung cấp được cấu hình; dịch vụ xem xét bởi chuyên viên chưa được mở bán.' },
      { title: 'Tôi có thể nhận hoàn tiền không?', body: 'Chính sách hủy và hoàn tiền chưa được phê duyệt. Website hiện không nhận thanh toán.' },
      { title: 'Trả phí có tăng cơ hội được cấp visa hoặc nhận vị trí không?', body: 'Không. Không khoản phí nào bảo đảm visa, hợp đồng Ausbildung, công nhận văn bằng hoặc kết quả tuyển chọn.' },
      { title: 'Thông tin cá nhân được xử lý thế nào?', body: 'Vui lòng xem thông báo quyền riêng tư hiện có trước khi sử dụng công cụ. Bản chính sách công khai vẫn chờ xác nhận nhà cung cấp, nơi xử lý, thời hạn lưu trữ và kênh liên hệ.' },
    ],
  },
  de: {
    title: 'Transparente Preise. Passende Unterstützung.', lead: 'Du kannst kostenlos beginnen. Kostenpflichtige Leistungen werden erst angeboten, wenn Leistungsumfang, Bedingungen und relevante Richtlinien klar veröffentlicht sind.', subheading: 'Wähle die passende Unterstützung', finePrint: 'Vorgeschlagene Preise; noch nicht verfügbare Leistungen sind gekennzeichnet. Keine Garantie für Visa, Ausbildungsplätze oder Zusagen.',
    serviceIntroTitle: 'Unterstützung für unterschiedliche Vorbereitungsschritte', serviceIntro: 'Starte mit kostenlosen Ressourcen. Wenn du mehr Unterstützung benötigst, informiere dich transparent über Umfang, Kosten und Leistungsform.',
    availability: { live: 'Verfügbar', coming_soon: 'In Vorbereitung', proposed_not_live: 'Vorgeschlagen · noch nicht verfügbar', legal_review_required: 'Rechtliche Prüfung erforderlich', paused: 'Pausiert' },
    unit: { free: 'kostenlos', document: 'pro Dokument', package: 'pro Unterlagenpaket', consultation: 'pro geplantem Gespräch', programme: 'pro geplantem Programm', month: 'pro geplantem Monat' },
    faq: [
      { title: 'Was ist derzeit kostenlos?', body: 'Öffentliche Ratgeber und Informationen auf der Website sind kostenlos. Der bestehende Dokumenten-Check ist im Konto verfügbar; Nutzungslimits richten sich nach der aktuellen Konfiguration.' },
      { title: 'Prüft ein Mensch die Dokumente?', body: 'Nicht standardmäßig. Der bestehende Ablauf nutzt automatisierte Analyse, wenn ein Anbieter konfiguriert ist. Eine persönliche Prüfung wird noch nicht angeboten.' },
      { title: 'Kann ich eine Erstattung erhalten?', body: 'Eine Stornierungs- und Erstattungsrichtlinie ist noch nicht freigegeben. Die Website nimmt derzeit keine Zahlungen an.' },
      { title: 'Erhöht eine Zahlung meine Chancen auf ein Visum oder einen Ausbildungsplatz?', body: 'Nein. Keine Zahlung garantiert ein Visum, einen Ausbildungsvertrag, Anerkennung oder ein Auswahlresultat.' },
      { title: 'Wie werden persönliche Daten verarbeitet?', body: 'Lies vor der Nutzung des Werkzeugs die vorhandenen Datenschutzhinweise. Die öffentliche Richtlinie wartet noch auf Angaben zu Anbietern, Verarbeitungsorten, Aufbewahrung und Kontakt.' },
    ],
  },
  en: {
    title: 'Transparent pricing. Support when you need it.', lead: 'You can start for free. Paid services are offered only when their scope, terms and relevant policies are clearly published.', subheading: 'Choose your level of support', finePrint: 'Proposed prices; unavailable services are clearly marked. No visa, placement or acceptance guarantees.',
    serviceIntroTitle: 'Support for different stages of preparation', serviceIntro: 'Start with free resources. If you need more support, compare the scope, price and delivery format of each service.',
    availability: { live: 'Available', coming_soon: 'Coming soon', proposed_not_live: 'Proposed · not available', legal_review_required: 'Legal review required', paused: 'Paused' },
    unit: { free: 'free', document: 'per document', package: 'per package', consultation: 'per proposed consultation', programme: 'per proposed programme', month: 'per proposed month' },
    faq: [
      { title: 'What is free now?', body: 'Public guides and information on this website are free to read. The existing document check is available in the account area; usage limits follow the current configuration.' },
      { title: 'Does a person review my document?', body: 'Not by default. The existing workflow uses automated analysis when a provider is configured. Human review is not currently offered for purchase.' },
      { title: 'Can I get a refund?', body: 'A cancellation and refund policy has not been approved. This website does not currently accept payments.' },
      { title: 'Does paying improve my visa or placement chances?', body: 'No. No payment guarantees a visa, Ausbildung contract, qualification recognition or selection outcome.' },
      { title: 'How is personal information handled?', body: 'Read the current privacy notice before using a tool. The public policy is awaiting provider, processing location, retention and contact details.' },
    ],
  },
};

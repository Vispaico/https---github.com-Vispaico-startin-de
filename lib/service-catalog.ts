import type { Locale } from './i18n';

export type ServiceStatus = 'live' | 'coming_soon' | 'proposed_not_live' | 'legal_review_required' | 'paused';
export type BillingUnit = 'free' | 'document' | 'package' | 'consultation' | 'programme' | 'month';
export type ServiceOffer = {
  id: string;
  priceVnd: number | null;
  billingUnit: BillingUnit;
  status: ServiceStatus;
  showIndicativePrice: boolean;
  humanReviewed: boolean;
  checkoutEnabled: boolean;
  inclusions: Record<Locale, string[]>;
  exclusions: Record<Locale, string[]>;
  names: Record<Locale, string>;
  summaries: Record<Locale, string>;
};

const neverCheckoutUnlessApproved = false;

export const services: ServiceOffer[] = [
  {
    id: 'explorer', priceVnd: 0, billingUnit: 'free', status: 'live', showIndicativePrice: true, humanReviewed: false, checkoutEnabled: false,
    names: { vi: 'Khám phá miễn phí', de: 'Kostenlos entdecken', en: 'Explorer' },
    summaries: { vi: 'Cẩm nang và tài nguyên giáo dục công khai.', de: 'Öffentliche Ratgeber und Informationsangebote.', en: 'Public guides and educational resources.' },
    inclusions: { vi: ['Đọc cẩm nang và thông tin công khai', 'Không cần thanh toán'], de: ['Öffentliche Ratgeber und Informationen lesen', 'Keine Zahlung erforderlich'], en: ['Read public guides and information', 'No payment required'] },
    exclusions: { vi: ['Không bao gồm tư vấn cá nhân'], de: ['Keine individuelle Beratung'], en: ['No personal consultation'] },
  },
  {
    id: 'basic-document-check', priceVnd: 0, billingUnit: 'free', status: 'live', showIndicativePrice: true, humanReviewed: false, checkoutEnabled: false,
    names: { vi: 'Kiểm tra hồ sơ cơ bản', de: 'Basis-Dokumenten-Check', en: 'Basic Document Check' },
    summaries: { vi: 'Công cụ kiểm tra hồ sơ hiện có trong khu vực tài khoản.', de: 'Der bestehende Dokumenten-Check im geschützten Konto.', en: 'The existing document check in the private workspace.' },
    inclusions: { vi: ['Tải CV hoặc thư động lực PDF/DOCX lên tài khoản', 'Giới hạn tải lên theo cấu hình hiện tại'], de: ['Lebenslauf oder Anschreiben als PDF/DOCX im Konto hochladen', 'Upload-Limits gemäß aktueller Konfiguration'], en: ['Upload a CV or motivation letter in PDF/DOCX to your account', 'Upload limits follow the current configuration'] },
    exclusions: { vi: ['Không xác minh tính xác thực, công nhận bằng cấp hoặc tư vấn pháp lý', 'Không có chuyên viên xem xét mặc định'], de: ['Keine Echtheitsprüfung, Anerkennung oder Rechtsberatung', 'Keine standardmäßige persönliche Prüfung'], en: ['No authenticity verification, qualification recognition or legal advice', 'No default human review'] },
  },
  {
    id: 'document-check-plus', priceVnd: 99_000, billingUnit: 'document', status: 'proposed_not_live', showIndicativePrice: true, humanReviewed: false, checkoutEnabled: neverCheckoutUnlessApproved,
    names: { vi: 'Kiểm tra hồ sơ Plus', de: 'Dokumenten-Check Plus', en: 'Document Check Plus' },
    summaries: { vi: 'Đề xuất đánh giá tự động chi tiết hơn cho một tài liệu.', de: 'Vorgeschlagene ausführlichere automatische Prüfung eines Dokuments.', en: 'A proposed, more detailed automated review of one document.' },
    inclusions: { vi: ['Gợi ý cải thiện theo tài liệu', 'Báo cáo có thể tải xuống — đang đề xuất'], de: ['Dokumentbezogene Verbesserungsvorschläge', 'Herunterladbarer Bericht — vorgeschlagen'], en: ['Document-specific improvement suggestions', 'Downloadable report — proposed'] },
    exclusions: { vi: ['Chưa có quy trình mua hoặc quyền lợi thanh toán', 'Không có người đánh giá'], de: ['Noch kein Kaufprozess oder bezahlter Leistungsanspruch', 'Keine menschliche Prüfung'], en: ['No purchase flow or paid entitlement exists', 'No human reviewer'] },
  },
  {
    id: 'application-package-review', priceVnd: 299_000, billingUnit: 'package', status: 'proposed_not_live', showIndicativePrice: true, humanReviewed: false, checkoutEnabled: neverCheckoutUnlessApproved,
    names: { vi: 'Kiểm tra bộ hồ sơ', de: 'Bewerbungsunterlagen-Paketprüfung', en: 'Application Package Review' },
    summaries: { vi: 'Đề xuất kiểm tra CV, thư động lực và sự nhất quán giữa các tài liệu.', de: 'Vorgeschlagene Prüfung von Lebenslauf, Anschreiben und Zusammenhängen im Paket.', en: 'A proposed review of a CV, motivation letter and consistency across documents.' },
    inclusions: { vi: ['Phạm vi một bộ hồ sơ đang được thiết kế'], de: ['Der Umfang eines Unterlagenpakets wird noch festgelegt'], en: ['Scope for one application package is still being defined'] },
    exclusions: { vi: ['Quy trình bộ hồ sơ chưa được triển khai', 'Không có thanh toán'], de: ['Paketprüfung ist noch nicht umgesetzt', 'Keine Zahlung'], en: ['Package workflow is not implemented', 'No payment'] },
  },
  {
    id: 'personal-germany-assessment', priceVnd: 490_000, billingUnit: 'consultation', status: 'proposed_not_live', showIndicativePrice: true, humanReviewed: true, checkoutEnabled: neverCheckoutUnlessApproved,
    names: { vi: 'Tư vấn định hướng cá nhân', de: 'Persönliche Deutschland-Beratung', en: 'Personal Germany Assessment' },
    summaries: { vi: 'Đề xuất buổi trao đổi định hướng và kế hoạch bằng văn bản.', de: 'Vorgeschlagenes Orientierungsgespräch mit schriftlichem Plan.', en: 'A proposed guidance conversation with a written roadmap.' },
    inclusions: { vi: ['Thời lượng và đầu ra chưa xác nhận'], de: ['Dauer und Ergebnis sind noch nicht bestätigt'], en: ['Duration and deliverables are not confirmed'] },
    exclusions: { vi: ['Chưa có chuyên viên, lịch đặt hoặc điều khoản được xác nhận', 'Không đánh giá thị thực cá nhân'], de: ['Keine bestätigten Beratenden, Termine oder Bedingungen', 'Keine individuelle Visumprüfung'], en: ['No confirmed advisors, booking or terms', 'No individual visa assessment'] },
  },
  {
    id: 'application-ready', priceVnd: 3_900_000, billingUnit: 'package', status: 'legal_review_required', showIndicativePrice: false, humanReviewed: true, checkoutEnabled: neverCheckoutUnlessApproved,
    names: { vi: 'Chuẩn bị hồ sơ ứng tuyển', de: 'Bewerbungsunterlagen vorbereiten', en: 'Application Ready' },
    summaries: { vi: 'Ý tưởng dịch vụ hỗ trợ biên tập CV và thư ứng tuyển.', de: 'Serviceidee zur Überarbeitung von Lebenslauf und Anschreiben.', en: 'A proposed service to prepare a CV and application letter.' },
    inclusions: { vi: ['Phạm vi, số lần chỉnh sửa và thời gian đang chờ phê duyệt'], de: ['Umfang, Überarbeitungen und Bearbeitungszeit warten auf Freigabe'], en: ['Scope, revision count and turnaround are awaiting approval'] },
    exclusions: { vi: ['Chưa mở bán; cần rà soát pháp lý và vận hành'], de: ['Nicht verfügbar; rechtliche und operative Prüfung erforderlich'], en: ['Not available; legal and operational review required'] },
  },
  {
    id: 'career-preparation', priceVnd: 7_900_000, billingUnit: 'programme', status: 'legal_review_required', showIndicativePrice: false, humanReviewed: true, checkoutEnabled: neverCheckoutUnlessApproved,
    names: { vi: 'Chuẩn bị nghề nghiệp Ausbildung', de: 'Ausbildungsvorbereitung', en: 'Ausbildung Career Preparation' },
    summaries: { vi: 'Ý tưởng chương trình chuẩn bị nghề nghiệp nhiều tuần.', de: 'Idee für ein mehrwöchiges Vorbereitungprogramm.', en: 'A proposed multi-week career preparation programme.' },
    inclusions: { vi: ['Nội dung và phạm vi chưa được xác nhận'], de: ['Inhalte und Umfang sind noch nicht bestätigt'], en: ['Content and scope are not confirmed'] },
    exclusions: { vi: ['Chưa mở bán; cần rà soát pháp lý và vận hành'], de: ['Nicht verfügbar; rechtliche und operative Prüfung erforderlich'], en: ['Not available; legal and operational review required'] },
  },
  {
    id: 'arrival-club', priceVnd: 149_000, billingUnit: 'month', status: 'proposed_not_live', showIndicativePrice: true, humanReviewed: false, checkoutEnabled: neverCheckoutUnlessApproved,
    names: { vi: 'Cộng đồng hội nhập', de: 'Ankommen-Club', en: 'Arrival Club' },
    summaries: { vi: 'Đề xuất cộng đồng và tài nguyên sau khi đến Đức.', de: 'Vorgeschlagene Community und Ressourcen für die erste Zeit in Deutschland.', en: 'A proposed community and resources for settling in Germany.' },
    inclusions: { vi: ['Nội dung, kiểm duyệt và thời điểm ra mắt chưa xác nhận'], de: ['Inhalte, Moderation und Start sind noch offen'], en: ['Content, moderation and launch timing are not confirmed'] },
    exclusions: { vi: ['Chưa có dịch vụ hoặc thanh toán định kỳ'], de: ['Noch kein Angebot oder Abonnement'], en: ['No live service or recurring payment'] },
  },
];

export function getService(id: string) { return services.find((service) => service.id === id); }
export function formatVnd(locale: Locale, amount: number) {
  const intlLocale = locale === 'vi' ? 'vi-VN' : locale === 'de' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(intlLocale, { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
}
export function canCheckout(service: ServiceOffer) {
  return service.status === 'live' && service.checkoutEnabled;
}


# 12-bildirim-iletisim

## Bağlamın amacı

İletişim bağlamı sohbet, destek ve bildirim akışlarını yönetir.
Bildirim motoru olay, şablon, sürüm ve teslim kayıtlarını ayırır. `tradehub_core/notifications/store.py:19`

## DocType listesi

### Ana kayıt

- [`Chat Attachment`](chat_attachment.md)
- [`Chat Reservation`](chat_reservation.md)
- [`Chat Thread Map`](chat_thread_map.md)
- [`Email Preference Category`](email_preference_category.md)
- [`Helpdesk Canned Response`](helpdesk_canned_response.md)
- [`Helpdesk SLA Policy`](helpdesk_sla_policy.md)
- [`Helpdesk Saved Filter`](helpdesk_saved_filter.md)
- [`Helpdesk Ticket Tag`](helpdesk_ticket_tag.md)
- [`Helpdesk Ticket Tag Link`](helpdesk_ticket_tag_link.md)
- [`Platform Notification`](platform_notification.md)
- [`Platform Notification Event`](platform_notification_event.md)
- [`Platform Notification Preference`](platform_notification_preference.md)
- [`Platform Notification Template`](platform_notification_template.md)
- [`Platform Notification Version`](platform_notification_version.md)
- [`Push Subscription`](push_subscription.md)
- [`Seller Availability Slot`](seller_availability_slot.md)
- [`User Email Preference`](user_email_preference.md)

### Alt tablo

- [`Email Preference Item`](email_preference_item.md)

### Ayar (single)

- [`Platform Notification Settings`](platform_notification_settings.md)
- [`Push Notification Settings`](push_notification_settings.md)

### Kayıt defteri (log)

- [`Platform Notification Delivery`](platform_notification_delivery.md)

## Bağlamın dışa açık API'si

`tradehub_core/notifications/api.py` önerilen girişleri sunar.
`tradehub_core/notifications/contracts.py` sohbet, destek ve bildirim için ortak giriş biçimlerini tanımlar.
Sohbet ve destek işleyicileri kendi alt paketlerinde kalır.

- `list_store_chat_attachments` ([`Chat Attachment`](chat_attachment.md)).
- `reserve_chat_slot`, `cancel_chat_reservation` ([`Chat Reservation`](chat_reservation.md)).
- `purge_store_chat_threads` ([`Chat Thread Map`](chat_thread_map.md)).
- `list_email_preferences` ([`Email Preference Category`](email_preference_category.md)).
- `set_ticket_tags` ([`Helpdesk Ticket Tag Link`](helpdesk_ticket_tag_link.md)).
- `list_inbox`, `mark_notification_read` ([`Platform Notification`](platform_notification.md)).
- `list_delivery_status` ([`Platform Notification Delivery`](platform_notification_delivery.md)).
- `get_notification_preferences`, `save_notification_preferences` ([`Platform Notification Preference`](platform_notification_preference.md)).
- `revoke_user_push_subscriptions` ([`Push Subscription`](push_subscription.md)).
- `list_chat_slots`, `save_chat_slot` ([`Seller Availability Slot`](seller_availability_slot.md)).
- `export_email_preferences` ([`User Email Preference`](user_email_preference.md)).

## Yayınlanan ve dinlenen olaylar

| Olay | Veri | Yayınlayan | Dinleyen |
| --- | --- | --- | --- |
| `logistics.exception_opened` | `event_id`, `exception_id`, `recipient_id` | `07-lojistik` | `12-bildirim-iletisim` |
| `logistics.sla_breached` | `event_id`, `exception_key`, `recipient_id` | `07-lojistik` | `12-bildirim-iletisim` |

Bu geçişte bağlam dışına yeni iletişim olayı önerilmiyor.
Yayıncı olayı değişiklikle birlikte `Outbox` tablosuna yazar.
İşlem kesinleşince `frappe.enqueue` dağıtımı başlatır.
İletişim servisi olay kimliğini kaydeder. Kanal başına tekrar teslimi engeller.

## Bağlamlar arası en ağır 10 bağımlılık

1. Lojistik uygulama içi bildirim tablosunu doğrudan sorgular. `tradehub_core/api/v1/logistics_ops.py:1024`
2. Lojistik, teslim kaydını istisna kimliği veya tekrar anahtarıyla birleştirir. `tradehub_core/api/v1/logistics_ops.py:1081`
3. Medya tarayıcısı sohbet eklerinin sayısını doğrudan sorgular. `tradehub_core/media/browse.py:179`
4. Mağaza temizliği sohbet eşlemelerini doğrudan siler. `tradehub_core/services/store_cleanup.py:30`, `tradehub_core/services/store_cleanup.py:37`
5. Rezervasyon servisi mağaza sohbet paketini doğrudan okur. `tradehub_core/api/reservation.py:107`
6. Destek süre denetimi harici Helpdesk biletine yorum ekler. `tradehub_core/utils/sla_checker.py:127`, `tradehub_core/utils/sla_checker.py:131`
7. Kimlikteki alıcı ve satıcı yetenekleri bildirim tercihlerini etkiler. `tradehub_core/notifications/preferences.py:34`
8. Hesap silme akışı tarayıcı bildirim aboneliğini doğrudan siler. `tradehub_core/privacy/account_deletion.py:350`, `tradehub_core/privacy/account_deletion.py:355`
9. Gizlilik dışa aktarımı e-posta tercihi tablosunun alanlarını listeler. `tradehub_core/privacy/data_export.py:204`
10. Stok işleyicisi bildirim yardımcı işlevini doğrudan çağırır. `tradehub_core/utils/stock.py:743`, `tradehub_core/utils/stock.py:786`

## Önerilen geçiş sırası

1. İletişim API’sini mevcut servislerin üstüne ekle. Alıcı ve mağaza yetkisi için test ekle.
2. İlk adımdan sonra lojistik ekranını ortak teslim görünümüne bağla. Eski kayıtların görünümünü koru.
3. İkinci adımdan sonra lojistik olay üreticilerini sırayla `Outbox` kaydına geçir.
4. İlk adımdan sonra medya tarayıcısını mağaza kapsamlı sohbet eki görünümüne bağla.
5. İlk adımdan sonra mağaza silme akışını sohbet temizleme API’sine bağla.
6. İlk adımdan sonra gizlilik dışa aktarımını tercih API’sine geçir.
7. Altıncı adımdan sonra abonelik iptalini hesap silme sırasında iletişim API’sine geçir.
8. Önceki adımlardan sonra Frappe modülünü ve denetleyici konumlarını taşı. Uyum girişlerini koru.

## Başka bağlama taşınması gereken DocType'lar

Bu listedeki kayıtlar için başka bir sahip bağlam önerilmiyor.
Satıcı zaman dilimi sohbet rezervasyonu ile birlikte yönetilsin. `tradehub_core/api/reservation.py:329`

## Bu bağlamda paralel çalışacak geliştiriciler için kurallar

- `CODEOWNERS` iletişim paketinin sahiplerini belirlesin. Test ve yamalar sahip pakette dursun.
- CI, sürekli bütünleştirme denetimidir. CI içinde paket içi işlevlere yapılan dış erişimleri engelle.
- Sohbet, destek ve gönderim değişikliklerini ayrı değişiklik istekleriyle birleştir.
- Şablon revizyonu ve teslim tekrarını aynı anda düzenleyen değişiklikleri sıraya al.
- Dış bağlamlar iletişim kayıtlarını yalnız iletişim API’si üzerinden değiştirsin.

## Epic özeti

- Chat Attachment: Önemli, Faz 4, Orta
- Chat Reservation: Acil, Faz 4, Orta
- Chat Thread Map: Önemli, Faz 4, Orta
- Email Preference Category: Önemli, Faz 4, Orta
- Email Preference Item: Önemli, Faz 4, Küçük
- Helpdesk Canned Response: Önemli, Faz 4, Orta
- Helpdesk SLA Policy: Önemli, Faz 4, Orta
- Helpdesk Saved Filter: Önemli, Faz 4, Orta
- Helpdesk Ticket Tag: Önemli, Faz 4, Küçük
- Helpdesk Ticket Tag Link: Önemli, Faz 4, Orta
- Platform Notification: Acil, Faz 4, Büyük
- Platform Notification Delivery: Acil, Faz 4, Büyük
- Platform Notification Event: Önemli, Faz 4, Orta
- Platform Notification Preference: Acil, Faz 4, Orta
- Platform Notification Settings: Önemli, Faz 4, Orta
- Platform Notification Template: Önemli, Faz 4, Orta
- Platform Notification Version: Önemli, Faz 4, Orta
- Push Notification Settings: Önemli, Faz 4, Küçük
- Push Subscription: Acil, Faz 4, Orta
- Seller Availability Slot: Önemli, Faz 4, Orta
- User Email Preference: Önemli, Faz 4, Orta

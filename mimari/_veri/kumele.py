"""DocType'ları iş bağlamlarına (bounded context) böler. İlk eşleşen kural kazanır."""
import json, re, sys, os, collections
D = sys.argv[1]
inv = json.load(open(os.path.join(D, "envanter.json"), encoding="utf-8"))
RULES = [
 ("13-uyum-gizlilik", r"^(Consent Policy|User Consent Log|Commercial Consent|DPA |Data Processing|Data Retention|Data Export|PII |Processing Activity|ROPA |Retention |Deferred Anonym)"),
 ("10-seo", r"^(SEO |Static Page SEO|MCP )"),
 ("08-medya", r"^(Media |Image Moderation Log)"),
 ("11-degerlendirme", r"^(Listing Review|Seller Review|Review |Reviewer |Trusted Reviewer|Listing Question|Question Helpful|Category Review Template|Template Question)"),
 ("07-lojistik", r"^(Shipment|Shipping|Carrier|Logistics|Proof of Delivery|Package Type|Vehicle Type|Service Coverage|Provider Operating|Seller Shipping|Issued Barcode|Region)"),
 ("06-vergi-fatura", r"^(Tax Rule|Listing Tax Rule|Order Tax Line|Invoice Document|Order Invoice|Platform Invoice|Seller Invoice Profile)"),
 ("05-odeme", r"^(Payment|Manual Payment|Bank Statement|Buyer Bank|Seller Balance|Seller Bank Account|Field Commission|Subscription Payment|Currency Rate|Supported Currency)"),
 ("04-siparis", r"^(Cart|Order|Coupon|RFQ|Seller Inquiry|Approved Supplier)"),
 ("12-bildirim-iletisim", r"^(Platform Notification|Push |Email Preference|User Email Preference|Chat |Helpdesk|Seller Availability Slot)"),
 ("03b-ice-aktarma", r"^(Bulk Import|Seller XML Feed|Product Mapping|Seller Value Mapping|Catalog Outbound|Catalog Product|Seller Product|Regex Pattern)"),
 ("03c-kesif", r"^(Category Embedding|Category Neighbour|Related |User Product View|Search History|Listing View Counter|Listing AB Test|AB Test|Buyer Favorite|Buybox)"),
 ("03a-katalog", r"^(Listing|Product|Attribute Set|Brand|UOM|Moderation Rule|Certification Type)"),
 ("09-icerik-vitrin", r"^(CMS |Hero Slide|Category Showcase|Header Notice|Dashboard|Field Help|Tradehub Theme|Site Maintenance|Social Proof|Teamslike|Translation|Storefront Layout)"),
 ("02-satici-magaza", r"^(Admin Seller Profile|Seller |KYB |KYC |Verification Source|Store Subscription|Subscription Plan|Pricing Plan|Feature Catalog|Trial Settings)"),
 ("01-kimlik-erisim", r"^(User |Buyer Profile|Buyer Sub User|Addresses|API |Mobile API|TH |Role |Permission Override|Authorization|Owner Transfer|Approval Rule|Email Verification|Sales Team|Cost Center)"),
 ("14-platform-cekirdek", r"^(Marketplace Settings|ECA |Tracking Settings)"),
]
out = {}; miss = []
for n in sorted(inv):
    for ctx, pat in RULES:
        if re.match(pat, n): out[n] = ctx; break
    else: miss.append(n)
c = collections.Counter(out.values())
for k in sorted(c): print(k, c[k])
print("eşleşmeyen:", miss)
json.dump(out, open(os.path.join(D, "baglamlar.json"), "w"), ensure_ascii=False, indent=1)

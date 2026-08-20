import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { useLang } from "@/lib/i18n";
import { ShoppingBag, Shirt, Coffee, Sparkles, ArrowRight } from "lucide-react";

const PRODUCTS = [
  { name: { id: "White Rock Tee", en: "White Rock Tee" }, priceIdr: 250_000, tag: "Cotton", icon: Shirt, accent: "from-amber-500/20" },
  { name: { id: "Sunset Cap", en: "Sunset Cap" }, priceIdr: 180_000, tag: "Embroidered", icon: Sparkles, accent: "from-amber-500/20" },
  { name: { id: "Beach Tote", en: "Beach Tote" }, priceIdr: 320_000, tag: "Canvas", icon: ShoppingBag, accent: "from-rose-500/20" },
  { name: { id: "Logo Tumbler", en: "Logo Tumbler" }, priceIdr: 210_000, tag: "Insulated", icon: Coffee, accent: "from-yellow-600/20" },
  { name: { id: "VIP Polo", en: "VIP Polo" }, priceIdr: 380_000, tag: "Premium", icon: Shirt, accent: "from-rose-500/20" },
  { name: { id: "Glow Bracelet", en: "Glow Bracelet" }, priceIdr: 150_000, tag: "Limited", icon: Sparkles, accent: "from-orange-500/20" },
];

export default function Merch() {
  const { tf, formatPrice } = useLang();
  const navigate = useNavigate();
  const [cart, setCart] = useState(0);
  const [added, setAdded] = useState<number | null>(null);

  const addToCart = (i: number) => {
    setCart((c) => c + 1);
    setAdded(i);
    window.setTimeout(() => setAdded((cur) => (cur === i ? null : cur)), 1500);
  };

  return (
    <div className="bg-[hsl(222_47%_6%)]">
      <PageHero
        bgImage="/assets/whiterock/aerial.jpg"
        eyebrow={tf({ id: "Merchandise", en: "Merchandise", ru: "Мерчандайз", ko: "머천다이즈" })}
        title={tf({ id: "Bawa Pulang White Rock", en: "Take White Rock Home", ru: "Забери White Rock с собой", ko: "White Rock을 집으로" })}
        subtitle={tf({
          id: "Koleksi eksklusif — apparel, aksesori, dan barang limited yang ngangenin hari di Melasti.",
          en: "An exclusive collection — apparel, accessories, and limited drops that capture a Melasti day.",
          ru: "Эксклюзивная коллекция — одежда, аксессуары и лимитированные новинки, в которых живёт день в Melasti.",
          ko: "독점 컬렉션 — 의류, 액세서리, 그리고 Melasti의 하루를 담은 한정판.",
        })}
      />

      <section className="py-20 px-5 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <SectionHeading align="left" eyebrow={tf({ id: "Store", en: "Store", ru: "Магазин", ko: "스토어" })} title={tf({ id: "Koleksi Terbaru", en: "Latest Drop", ru: "Новая коллекция", ko: "최신 컬렉션" })} className="mb-0" />
            <div className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-slate-300">
              <ShoppingBag className="h-4 w-4 text-amber-300" /> {tf({ id: "Keranjang", en: "Cart", ru: "Корзина", ko: "장바구니" })}: {cart}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={i} delay={i * 60}>
                  <Card className="glow-card glass rounded-3xl overflow-hidden h-full">
                    <div className={`h-44 bg-gradient-to-br ${p.accent} grid place-items-center`}>
                      <Icon className="h-16 w-16 text-white/80" />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white">{tf(p.name)}</h3>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 border border-white/10 rounded-full px-2 py-0.5">{p.tag}</span>
                      </div>
                      <div className="text-amber-300 font-bold mb-4">{formatPrice(p.priceIdr)}</div>
                      <Button
                        variant="elegant"
                        size="sm"
                        className="w-full"
                        onClick={() => addToCart(i)}
                      >
                        {added === i ? (
                          <>{tf({ id: "Ditambahkan", en: "Added ✓", ru: "Добавлено ✓", ko: "추가됨 ✓" })}</>
                        ) : (
                          <>{tf({ id: "Tambah", en: "Add to Cart", ru: "В корзину", ko: "장바구니에 담기" })} <ArrowRight className="h-4 w-4" /></>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="luxury"
              size="lg"
              disabled={cart === 0}
              onClick={() => navigate("/contact")}
            >
              <ShoppingBag className="h-5 w-5" /> {tf({ id: "Checkout", en: "Checkout", ru: "Оформить заказ", ko: "결제하기" })} ({cart})
            </Button>
            <p className="text-center text-sm text-slate-500">
              {tf({ id: "Checkout via WhatsApp concierge. Tanya Sarah untuk stok & ukuran.", en: "Checkout via our WhatsApp concierge. Ask Sarah for sizes & stock.", ru: "Оформление через WhatsApp-консьержа. Уточняйте у Sarah наличие и размеры.", ko: "결제는 WhatsApp 컨시어지를 통해. 사이즈와 재고는 Sarah에게 문의하세요." })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

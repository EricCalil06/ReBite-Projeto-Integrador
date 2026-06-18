import bannerDesperdicio from "../../assets/bannerDesperdicio.png";

function BannerSection() {
  return (
    <section className="w-full my-8 md:my-12">
      <img
        src={bannerDesperdicio}
        alt="55 Milhões de Toneladas de alimentos são jogadas fora todos os anos"
        className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] object-cover"
      />
    </section>
  );
}

export default BannerSection;
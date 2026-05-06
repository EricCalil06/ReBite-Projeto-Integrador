import bannerDesperdicio from "../../assets/bannerDesperdicio.png";

function BannerSection() {
  return (
    <section className="w-full my-12">
        <img
          src={bannerDesperdicio}
          alt="55 Milhões de Toneladas de alimentos são jogadas fora todos os anos"
          className="w-full h-[500px] object-cover"
        />
      </section>
  );
}

export default BannerSection;

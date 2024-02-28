import Header from "../components/header";
import "../assets/styles/styles.css";
import img2 from "../assets/images/index/img-2.png";
import 'animate.css';
function Index() {
    return (
        <>
        
            <Header/>
            <main>
                <section id="hero-index" className="h-screen w-full">
                    <div className="bg-black/50 p-10 h-full w-full flex flex-col justify-center items-center gap-3">
                        <h1 class=" text-white text-5xl font-bold animate_animated animate__backInDown">
                            ¡Conoce el mundo Pokémon y aventúrate!
                        </h1>
                        <p className="text-white text-2xl italic text-center">¡Bienvenido a un mundo lleno de maravillas donde tus sueños se hacen realidad junto a tus fieles compañeros! Entra y descubre la magia que aguarda.</p>
                    </div>
                </section>

                <section id="about-us" className="w-full bg-gradient-to-br from-red-600 to-brown-800 flex flex-col justify-center items-center gap-5 p-5 text-white ">
                    <div className="text-center space-y-5 w-3/4">
                        <h2 className="text-3xl font-bold">¿Qué es la Pokédex virtual?</h2>
                        <p className="text-xl">¡Bienvenido a Pokédex virtual, tu portal definitivo para todo lo relacionado con el fascinante mundo de los Pokémon! Aquí encontrarás una amplia gama de recursos, desde datos detallados sobre tus Pokémon favoritos hasta estrategias de batalla y consejos de entrenamiento. Sumérgete en nuestra extensa base de datos y descubre todo lo que necesitas saber para convertirte en un maestro Pokémon.</p>
                    </div>
                   <div className="">
                    <img src={img2} className="h-96 object-contain" alt="" />
                   </div>
                </section>
            </main>
        </>
    )
}

export default Index;

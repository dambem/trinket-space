import Image from "next/image";
import { socialLinks } from "./config";
import Link from "next/link";
import AnimatedBackground from "./components/animated_color";
import {
  FaXTwitter,
  FaGithub,
  FaInstagram,
  FaRss,
  FaLinkedinIn,
} from "react-icons/fa6";
function SocialLink({ href, icon: Icon }) {
  return (
    <Link href={href}  style={{display: 'inline-block'}} target="_blank" rel="noopener noreferrer">
      <Icon />
    </Link>
  );
}
export default function Page() {
  return (
    <section>
      <h1 className="text-2xl font-medium tracking-tight title">
        about me
      </h1>
      <br></br>
      <main className="main-section mt-4">
      <h2 className="section-title text-xl">Welcome!</h2>
      <Image
          src="/avatar.png"
          alt="Profile photo"
          className="rounded-full bg-gray-100 block lg:mt-5 mt-0 lg:mb-5 mb-10 mx-auto sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0"
          unoptimized
          width={160}
          height={160}
          priority
        />
      <a href={socialLinks.github} target="_blank">
      <div className="relative">

        <div className="absolute top-0 left-0 w-full h-full -z-10 mix-blend-screen overflow-y-hidden">
          <AnimatedBackground />
        </div>

        </div>
      </a>
      <div className="prose prose-neutral dark:prose-invert max-w-prose">
      <p>
         I'm a Damian, a Software Engineer at <Link href="https://ada-mode.com/">
          AdaMode
        </Link> & <Link href="https://windscope.com/">Windscope</Link> 
        ,
        where I contribute to cutting-edge AI projects in the field of clean energy and renewables. 
      </p>
      <p>
          I also created <Link href="https://geochip.uk">
          GeoChip
        </Link> a business creating 3D printed and XR projects aimed around making model cities feel alive. 
      </p>
      <p>
        I'm especially excited in the creation of different technical experiences, and love the field of digital technology. 
        Contact me ( <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />  <SocialLink href={socialLinks.instagram} icon={FaInstagram} /> ) to have a chat about what we might be able to create! 

      </p>
      <p>
        This serves as a little trinket collection of projects, interests, and samples of writing - in a futile attempt to bring back the old internet
      </p>

      <a href="https://calendar.notion.so/meet/damian-7sjb11who/zu4r4j3p" className="contact-link" aria-label="GitHub">
              <span>⚡</span> Set-Up a Quick Coffee Chat
      </a>

      </div>
      </main>
    </section>
  );
}

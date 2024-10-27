import Image from "next/image";
import { socialLinks } from "./config";
import Link from "next/link";
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
      <a href={socialLinks.github} target="_blank">
        <Image
          src="/avatar.png"
          alt="Profile photo"
          className="rounded-full bg-gray-100 block lg:mt-5 mt-0 lg:mb-5 mb-10 mx-auto sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0"
          unoptimized
          width={160}
          height={160}
          priority
        />
      </a>

      <h1 className="mb-8 text-2xl font-medium tracking-tight">
        lamplight - a small portfolio
      </h1>
      <hr></hr>

      <div className="prose prose-neutral dark:prose-invert">
      <p>
        Currently, I'm a software engineer at <Link href="https://ada-mode.com/">
          AdaMode
        </Link> & <Link href="https://windscope.com/">Windscope</Link> 
        ,
        where I contribute to cutting-edge projects in the field of clean energy and renewables. 
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
      </div>
    </section>
  );
}

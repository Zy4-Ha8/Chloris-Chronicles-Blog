import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faInstagram,
  faLinkedin,
  faTelegram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
const Footer = () => {
  return (
    <div className="bg-black/20 p-5 rounded-t-4xl   ">
      <div className="max-w-[1640px] m-auto ">
        <h1 className="text-2xl text-center">Let’s Build Something Together</h1>
        <div className="my-8">
          <ul className="flex justify-evenly sm:flex-row flex-col gap-1">
            <li>
              <a
                className="flex justify-center items-center gap-1 text-lg hover:text-pink-800 duration-300"
                href="https://www.instagram.com/h_a_i_d_e_r_l_a_i?igsh=MWd0azVxZDgyamFjaA=="
                target="_blank"
              >
                <FontAwesomeIcon icon={faInstagram} />
                instagram
              </a>
            </li>
            <li>
              <a
                className="flex justify-center items-center gap-1 text-lg hover:text-green-700 duration-300"
                href="https://wa.me/message/WI3JQHRNQCM7A1"
                target="_blank"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                className="flex justify-center items-center gap-1 text-lg hover:text-gray-700 duration-300"
                href="https://github.com/Zy4-Ha8"
              >
                <FontAwesomeIcon icon={faGithub} />
                Github
              </a>
            </li>{" "}
            <li>
              <a
                className="flex justify-center items-center gap-1 text-lg hover:text-blue-600 duration-300"
                href="https://t.me/haid_er_ali"
                target="_blank"
              >
                <FontAwesomeIcon icon={faTelegram} />
                Telegram
              </a>
            </li>{" "}
            <li>
              <a
                className="flex justify-center items-center gap-1 text-lg hover:text-blue-500 duration-300"
                href="https://www.linkedin.com/in/haider-ali-232783289?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              >
                <FontAwesomeIcon icon={faLinkedin} />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;

import "./Footer.css";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__detail">Developed by Brandon Dooley</p>
      <p className="footer__detail">{new Date().getFullYear()}</p>
    </footer>
  );
}

export default Footer;

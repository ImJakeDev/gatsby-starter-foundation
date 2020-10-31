import React from "react"
import {Link} from "gatsby"
import { RiHeart2Line } from "react-icons/ri";

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <p>A GatsbyJS website with a Netlify CMS, Made with <span className="icon -love"><RiHeart2Line/></span> by <Link to="/">Jake</Link></p>
    </div>
  </footer>
)

export default Footer
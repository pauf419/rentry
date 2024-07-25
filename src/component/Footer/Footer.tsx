import m from "./Footer.module.sass"

const Footer = () => {
    return (
        <div className={m.FooterWrapper}>
            <hr></hr>
            <div className={m.FooterLinks}>
                <a href="/">new</a>
            </div>
            <div className={m.FooterCredits}>
                <span>Paste29 - Markdown Paste Service </span>
            </div>
        </div>
    )
}

export default Footer
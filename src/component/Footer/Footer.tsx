import m from "./Footer.module.sass"

const Footer = () => {
    return (
        <div className={m.FooterWrapper}>
            <hr></hr>
            <div className={m.FooterLinks}>
                <a href="/new">new</a>
                <span>.</span>
                <a href="/what">what</a>
                <span>.</span>
                <a href="/how">how</a>
                <span>.</span>
                <a href="/langs">langs</a>
                <span>.</span>
                <a href="/what#contacts">contacts</a>
            </div>
            <div className={m.FooterCredits}>
                <span>Rentry.co - Markdown Paste Service </span>
            </div>
        </div>
    )
}

export default Footer
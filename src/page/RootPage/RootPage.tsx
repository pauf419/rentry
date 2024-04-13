
import Footer from "../../component/Footer/Footer"
import How from "../../component/HowTav/How"
import PreviewTab from "../../component/PreviewTab/PreviewTab"
import TextTab from "../../component/TextTab/TextTab"
import Toolbar from "../../component/Toolbar/Toolbar"
import m from "./RootPage.module.sass"

const RootPage = () => {
    return (
        <div className={m.RootPageContainer}>
            <Toolbar tabs={[
                {
                    node: <TextTab/>,
                    title: "Text"
                },
                {
                    node: <PreviewTab/>,
                    title: "Preview"
                },
                {
                    node: <How/>,
                    title: "How"
                }
            ]}/>
            <div className={m.ToolbarFooter}>
                <button className={`${m.GoBtn}`}>
                    Go
                </button>

                <div className={m.FooterInps}>
                    <input placeholder="Custom edit code"/>
                    <input placeholder="Custom url"/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default RootPage
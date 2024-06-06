import { observer } from "mobx-react-lite";
import { FC } from "react";
import m from "../../page/RootPage/RootPage.module.sass"
import IVisitor from "../../interface/IVisitor";
import ReactCountryFlag from "react-country-flag";


interface IVisitorExtendedProps {
    visitor: IVisitor
    index: number
}

const VisitorExtended: FC<IVisitorExtendedProps> = ({visitor, index}) => { 

    const formatted_date = (mill:number) => {
        var result="";
        var d = new Date(mill);
        result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
                    " "+ d.getHours()+":"+d.getMinutes()+":"+
                    d.getSeconds()
        return result;
    }

    return ( 
        <>
            <div className={m.VisitorParam}>
                {index}
            </div>
            <div className={m.Spacer}></div>
            <div className={m.VisitorParam}>
                <ReactCountryFlag svg countryCode={visitor.country !== null ? visitor.country : "UA"} />
            </div>
            <div className={m.Spacer}></div>
            <div className={m.VisitorParam}>
                {visitor.ip}
            </div>
            <div className={m.Spacer}></div>
            <div className={m.VisitorParam}>
                {formatted_date(Number(visitor.timestamp))}
                
            </div>
        </>
    )
}

export default observer(VisitorExtended)
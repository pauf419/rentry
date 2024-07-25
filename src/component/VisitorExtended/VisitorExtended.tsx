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

    const formatted_date = (mill: number) => {
        const padZero = (num: number) => (num < 10 ? '0' : '') + num;
    
        const d = new Date(mill);
        const year = d.getFullYear();
        const month = padZero(d.getMonth() + 1);
        const date = padZero(d.getDate());
        const hours = padZero(d.getHours());
        const minutes = padZero(d.getMinutes());
        const seconds = padZero(d.getSeconds());
    
        return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
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
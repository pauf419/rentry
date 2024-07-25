import { FC, useEffect, useState } from "react"
import m from "./PaginationController.module.sass"

interface PaginationControllerProps {
    pages: number
    cb: (page: number) => void
}

const PaginationController: FC<PaginationControllerProps> = ({ pages, cb }) => {

    const [active, setActive] = useState<number>(0)
    const [leftDisabled, setLeftDisabled] = useState<boolean>(true)
    const [rightDisabled, setRightDisabled] = useState<boolean>(false)

    const handleClick = (page: number) => {
        setActive(page)
        cb(page)
    }

    useEffect(() => {
        setLeftDisabled(active === 0)
        setRightDisabled(active === pages - 1)
    }, [active, pages])

    const renderPages = () => {
        const pageButtons = []
        const totalVisible = 10
        const edgeCount = 1
        const surroundingCount = 3

        if (pages <= totalVisible) {
            for (let i = 0; i < pages; i++) {
                pageButtons.push(
                    <button key={i} className={m.PaginationControllerBtn} disabled={active === i} onClick={() => handleClick(i)}>
                        {i + 1}
                    </button>
                )
            }
        } else {
            for (let i = 0; i < edgeCount; i++) {
                pageButtons.push(
                    <button key={i} className={m.PaginationControllerBtn} disabled={active === i} onClick={() => handleClick(i)}>
                        {i + 1}
                    </button>
                )
            }

            if (active > surroundingCount + edgeCount) {
                pageButtons.push(<span key="left-dots">...</span>)
            }

            const startPage = Math.max(edgeCount, active - surroundingCount)
            const endPage = Math.min(pages - edgeCount, active + surroundingCount + 1)

            for (let i = startPage; i < endPage; i++) {
                pageButtons.push(
                    <button key={i} className={m.PaginationControllerBtn} disabled={active === i} onClick={() => handleClick(i)}>
                        {i + 1}
                    </button>
                )
            }

            if (active < pages - surroundingCount - edgeCount - 1) {
                pageButtons.push(<span key="right-dots">...</span>)
            }

            for (let i = pages - edgeCount; i < pages; i++) {
                pageButtons.push(
                    <button key={i} className={m.PaginationControllerBtn} disabled={active === i} onClick={() => handleClick(i)}>
                        {i + 1}
                    </button>
                )
            }
        }

        return pageButtons
    }

    return (
        <div className={m.PaginationControllerWrapper}>
            <button className={m.PaginationControllerBtn} disabled={leftDisabled} onClick={() => handleClick(active - 1)}>
                ←
            </button>
            {renderPages()}
            <button className={m.PaginationControllerBtn} disabled={rightDisabled} onClick={() => handleClick(active + 1)}>
                →
            </button>
        </div>
    )
}

export default PaginationController
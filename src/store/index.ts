import { makeAutoObservable } from "mobx";

export default class Store {

    text: string = ""

    setText(text: string) {
        this.text = text
    }

    constructor() {
        makeAutoObservable(this)
    }
}
import { makeAutoObservable } from "mobx";

export default class Store {

    text:string = "sdsds"

    constructor() {
        makeAutoObservable(this)
    }
}
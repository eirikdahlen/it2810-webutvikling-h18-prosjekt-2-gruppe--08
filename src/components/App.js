import React, {Component} from 'react';
import axios from 'axios';

// Component
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Menu from './Menu';
import Tabs from './Tabs';


class App extends Component {

    constructor(props) {
        super(props);

        this.tabUpdate = this.tabUpdate.bind(this)
        this.categoryUpdate = this.categoryUpdate.bind(this)

        this.state = {
            activeTab: 0,
            activeTabs: [true, false, false, false],
            activePictures: ["", "", "", ""],
            activeTexts: ["", "", "", ""],
            activeAudios: ["", "", "", ""],

            activeCategories: ["animal", "lyrics", "jazz"]
        }
    }

    // For å få opp en startutstilling
    componentDidMount(){
      this.tabUpdate(this.state.activeTab)
    }


    getPictureOnTab() {
        let picturesURL = "/content/images/" + this.state.activeCategories[0]
            + "/" + this.state.activeCategories[0] + (this.state.activeTab + 1) + ".svg"
        // ---------- HENTER BILDE ------------------
        if (this.state.activePictures[this.state.activeTab] === "") {
            axios.get(picturesURL)
                .then((response) => {
                    let pictures = this.state.activePictures
                    pictures[this.state.activeTab] = response.data
                    this.setState({
                        activePictures: pictures
                    })
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
        }
    }




    getTextOnTab() {
        let textsURL = "/content/texts/" + this.state.activeCategories[1]
            + ".json";
        // ---------- HENTER TEKST ------------------
        // Sjekker at vi ikke allerede har hentet tekst til denne taben
        if (this.state.activeTexts[this.state.activeTab] === "") {
            axios.get(textsURL)
                .then((response) => {
                    let texts = this.state.activeTexts;
                    texts[this.state.activeTab] = response.data[this.state.activeTab].text;
                    this.setState({
                        activeTexts: texts
                    })
                })
                .catch(function (error) {
                });
        }
        else {
        }
    }

    getAudioOnTab() {
        let audioURL = "/content/audios/" + this.state.activeCategories[2]
            + "/" + this.state.activeCategories[2] + (this.state.activeTab + 1) + ".mp3";
        // Sjekker at vi ikke allerede har hentet lyd til denne taben
        if (this.state.activeAudios[this.state.activeTab] === "") {
            let audios = this.state.activeAudios;
            audios[this.state.activeTab] = audioURL;
            this.setState({
                activeAudios: audios
            })
        }
        else {
        }
    }

    tabUpdate(tab) {
        // TODO: Skal kun skje endring dersom man endrer tab
        if (tab > -1) {
            let activeTabs = [false, false, false, false];
            activeTabs[tab] = true;
            this.setState({
                    activeTabs: activeTabs,
                    activeTab: tab
                }, () => {
                    this.getMedia()
                }
            )
        }
    }

    getMedia() {
        // Om en kategori for mediatypene er valgt så hentes et medie fra samlingen under den kategorien
        if (this.state.activeCategories[0] !== "") {
            this.getPictureOnTab()
        }
        if (this.state.activeCategories[1] !== "") {
            this.getTextOnTab()
        }
        if (this.state.activeCategories[2] !== "") {
            this.getAudioOnTab()
        }
    }


    // Når en ny kategori velges kjøres denne funksjonen som oppdaterer staten
    categoryUpdate(catNo, category) {
        let categories = this.state.activeCategories;
        categories[catNo] = category;

        // Når en ny kategori endres for et medie så tømmes de allerede innhentede mediene for den kategorien
        this.clearData(catNo);

        // Setter tabUpdate i en callback for å sikre at den kalles ETTER at staten er endret
        this.setState({
            activeCategories: categories
        }, () => {
            this.tabUpdate(this.state.activeTab)
        })

    }

    clearData(catNo) {
        if (catNo === 0) {
            this.setState({
                activePictures: ["", "", "", ""]
            })
        }
        else if (catNo === 1) {
            this.setState({
                activeTexts: ["", "", "", ""]
            })
        }
        else if (catNo === 2) {
            this.setState({
                activeAudios: ["", "", "", ""]
            })
        }

    }


    render() {
        return (
            <div className="main_container">
                <Header/>
                <Tabs onTabSelect={this.tabUpdate} activeTabs={this.state.activeTabs}/>

                <Home text={this.state.activeTexts[this.state.activeTab]}
                      picture={this.state.activePictures[this.state.activeTab]}
                      audio={this.state.activeAudios[this.state.activeTab]}/>

                <Menu
                    pictureCategory={this.state.activeCategories[0]}
                    textCategory={this.state.activeCategories[1]}
                    audioCategory={this.state.activeCategories[2]}
                    onCategoryChanged={this.categoryUpdate}
                />
                <Footer/>
            </div>
        );
    }
}


export default App;

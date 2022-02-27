const menu = [$("#CrayfishMenu"), $("#CrayfishCredits"), $("#CrayfishGame")];

function NavigateMenu(index) {
    for (let i = 0; i < menu.length; i++) {
        if (i == index) {
            menu[i].SetHasClass("Invisible", false);
        } else {
            menu[i].SetHasClass("Invisible", true);
        }
    }
}

// state keeps track of choices using booleans
let state = {}

// capturing from html document
const text = document.getElementById("text");
const buttons = document.querySelectorAll("#choices button");

// boolean for whether choice should be displayed based on game state
function validChoice(choice) {
    return choice.requiredState == null || choice.requiredState(state)
}// to show text and options
function displayScene(sceneID) {
    const scene = scenes[sceneID]

    // check if scene should be skipped and do so
    if (scene.requiredState != null && !scene.requiredState(state))
    {
        displayScene(scene.choices[0].next)
        return
    }


    text.textContent = scene.text
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    scene.choices.forEach(choice => {
        if (validChoice(choice)) {
            const btn = document.createElement("button");
            btn.textContent = choice.text;
            btn.onclick = () => {
                state = Object.assign(state, choice.setState)
                displayScene(choice.next);
            }   
            choicesDiv.appendChild(btn);
        }
    });
    console.log("Scene:" + sceneID)
    console.log(state)
}

// to start the game
function startGame() {
    state = {}
    displayScene("play")
}
// a scene has: ID (unique), text, choices (choice desc + next scene ID)
const scenes = {
    play: {
        text: "Where is Home? A Narrative Game by Dami",
        choices: [{text: "Start", next: "begin"}]
    },
    begin: {
        text: "You wake up to the sensation of light droplets on your face. A canopy of leaves dominate your view, with rays of sunlight peeking through. \nThere is the soft chirping of birds, the hum of insect life, and the void of memories inside you. \n\n Where are you? \n\n You sit up, and look around. You are in a dense forest. It seems to have no significance to you. \nThe grass beneath you is damp. So are your clothes. Actually, they’re soaked. Only now do you realise that they cling to your skin.\n\nWhat are you doing in such a place? How did you end up here? \nYou stagger to your feet, and pull your wet hair off the sides of your face. \nPerhaps you should get going. But go where? Where is there to go? \nYou don’t know, but your feet seem to move on their own, one after the other, slowly but surely. \n\nA few minutes have passed, and you come across a speck of purple ahead, against a canvas of greens and browns. You pick up the pace, wondering what it could be. You crouch and dig the foliage that hides it. \n\nA rag doll. You examine it carefully. \nIt’s tattered; one arm is almost falling apart. \n\nPoor doll. Like you, it has found itself in a forest, far away from home.  \n\nAh, yes. Home. Where is home? In this forest? You take another look at the doll.", 
        choices: [{text: "Take it with you", next: "take_doll", setState: {took_doll: true}}, {text: "Leave it be", next: "leave_doll", setState: {took_doll: false}}]
    },
    take_doll: {
        text: "You reach out to pick up the doll. It’s soaked with rainwater. You consider wringing it out, but the loose arm causes you to reconsider.\n\nDo you know how to sew? Or did you? You take it gently, and place it in the pocket of your raincoat, with its head peaking out. Now, you have a new companion. Perhaps, you can both find your ways home together.",
        choices: [{text: "OK", next: "complication"}],
        requiredState: (currentState) => currentState.took_doll
    },
    leave_doll: {
        text: "Perhaps it’d be best to leave the doll as is. Someone must have forgotten it, and must be searching for it. Better leave it in its place so they find it.",
        choices: [{text: "OK", next: "complication"}],
        requiredState: (currentState) => !currentState.took_doll
    },
    complication: {
        text: "As you walk through the forest, the wind starts to pick up. You pull your hood over your head for warmth. The sun has disappeared, and the atmosphere has gotten chilly. Is a storm approaching? That would be worrisome. Your clothes are not yet dry from whatever happened last night. You pick up the pace, though you still don’t know where you are going. It’s almost as though your feet have decided the destination without consulting your brain.\n\nThe sound of water rushing catches your attention. Up ahead, you see a clearing of the forest. When you arrive to the end of the forest, you are met with a river before you. It is fierce, aggravated by the storm above. The waves are harsh against the riverbank, and against the few stepping stones in it. The river, though narrow, seems deep. Apart from the wet stepping stones, there is no other way across. \n\nYou could turn back, but the eerieness of the forest isn't too inviting …",
        choices: [{text: "Take the stepping stones", next: "stones", setState: {stones: true}}, {text: "Wade through the river", next: "wade", setState: {wade: true}}]
    },
    stones: {
        text: "You approach the first stone, which happens to be a little further from the bank than you would have liked. Nonetheless, you make the stretch—only just— and balance yourself amidst the ferocious river. The next couple of stones are harder to reach, you just make sure you don’t take any long jumps. You keep your eyes fixed on your shoes. The river licks against your ankles. You get nervous. You slip.\n\nThe water is cold and drains all heat from you. You splatter and splash about, making sense of what is happening. It has started to rain again. Could things get any worse?",
        choices: [{text: "OK", next: "other_side"}]
    },
    wade: {
        text: "You place one foot in. The riverbed is low, and when you fully submerge yourself in the river, it comes up to your chest. You wade through, the river rushing around you and over you.",
        choices: [{text: "OK", next: "other_side"}]
    },
    other_side: {
        text: "The rain falls heavier and pellets against your thin raincoat. As you move across the river, it feels as though the opposite side is moving further and further away. You have a pounding headache, and your mouth has an unpleasant tinge of rainwater. You finally reach the bank, and haul yourself out. Ah, you made it! And all in one piece!",
        choices: [{text: "OK", next: "injury"}]
    },
    injury: {
        text: "Well, mostly—you have a nasty gash on your knee from when you slipped off the stones.",
        choices: [{text: "Ouch ...", next: "lost_doll"}],
        requiredState: (currentState) => currentState.stones
    },
    lost_doll: {
        text: "You pat yourself down. Something is missing. \n\nThe ragdoll. \n\nYou look behind you. \nThe river has swallowed her up. You feel guilty. Maybe you should have left her where you found her.",
        choices: [{text: "OK", next: "resolution"}],
        requiredState: (currentState) => currentState.took_doll
    },
    resolution: {
        text: "Your stomach rumbles. Oh, how you’d love something warm to eat. Well, better get moving.\nIn front of you is just plain grass. No houses, no trees, no dirt path. Just grass. Which way is the right way? \nYou feel overwhelmed and tired. How on earth are you supposed to get back home? You sink to the floor in exasperation and close your eyes.",
        choices: [{text: "OK", next: "benny"}]
    },
    benny: {
        text: "The sound of barking awakens you. You open your eyes to see a golden Labrador standing over you. A green collar around its neck. \n\n“Benny!” you say. Your voice is hoarse. \n\nThings start coming back to you now. \nYou’d been out with Benny, walking towards the forest, he ran ahead, you after him …\nBenny jumps on you and you sit up with a yelp. You cuddle him, and though his fur is wet, you’ve never felt so warm.",
        choices: [{text: "OK", next: "ending", requiredState: (currentState) => !currentState.took_doll}, {text: "OK", next: "secret_ending", requiredState: (currentState) => currentState.took_doll}]
    },
    ending: {
        text: "You smile at Benny. \n\nYou’ve found home.",
        choices: [],
        requiredState: (currentState) => !currentState.took_doll
    },
    secret_ending: {
        text: "You look to your side. The ragdoll is there. You smile at Benny. \n\nYou’ve found home.",
        choices: [],
        requiredState: (currentState) => currentState.took_doll
    }
};

startGame()


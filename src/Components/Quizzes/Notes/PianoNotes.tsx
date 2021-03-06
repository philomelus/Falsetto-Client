import * as React from "react";

import { Vector2D } from '../../../lib/Core/Vector2D';
import { Size2D } from "../../../lib/Core/Size2D";
import { Rect2D } from '../../../lib/Core/Rect2D';
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardLevel, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch, getPitchRange } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { PianoKeysAnswerSelect } from '../../Utils/PianoKeysAnswerSelect';

const flashCardSetId = "pianoNotes1Octave";

const lowestPitch = new Pitch(PitchLetter.C, 0, 4);
const highestPitch = new Pitch(PitchLetter.B, 0, 4);
const pitches = getPitchRange(lowestPitch, highestPitch);

const pianoKeyboardRect = new Rect2D(new Size2D(200, 100), new Vector2D(0, 0));
const pianoStyle = { width: "100%", maxWidth: "200px" };

function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const key = info.flashCards.indexOf(info.currentFlashCard);
  const correctAnswer = [(info.currentFlashCard.frontSide.data as Pitch)];
  
  return <PianoKeysAnswerSelect
    key={key} size={pianoKeyboardRect.size} lowestPitch={lowestPitch} highestPitch={highestPitch}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} maxNumPitches={1} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={true} />;
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Notes", createFlashCards);
  flashCardSet.containerHeight = "120px";
  flashCardSet.moreInfoUri = "/essential-music-theory/notes";
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    [
      new FlashCardLevel(
        "Natural Notes",
        flashCards
          .filter(fc => (fc.frontSide.data as Pitch).isNatural)
          .map(fc => fc.id),
        (curConfigData: any) => null
      ),
      new FlashCardLevel(
        "All Notes",
        flashCards.map(fc => fc.id),
        (curConfigData: any) => null
      )
    ]
  );

  return flashCardSet;
}

function createFlashCards(): FlashCard[] {
  return pitches
    .map((pitch, i) => {
      const deserializedId = {
        set: flashCardSetId,
        note: pitch.toOneAccidentalAmbiguousString(false, false)
      };
      const id = JSON.stringify(deserializedId);

      const pitchString = pitch.toOneAccidentalAmbiguousString(false, true);

      return new FlashCard(
        id,
        new FlashCardSide(
          pitchString,
          pitch
        ),
        new FlashCardSide(
          () => (
            <PianoKeyboard
              rect={pianoKeyboardRect}
              lowestPitch={lowestPitch}
              highestPitch={highestPitch}
              pressedPitches={[pitch]}
              style={pianoStyle}
            />
          )
        )
      );
    }
  );
}

export const flashCardSet = createFlashCardSet();
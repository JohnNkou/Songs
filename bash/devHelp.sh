#!/bin/bash
soundLib=/System/Library/Sounds

if [[ $1 == "CorrectCode" ]]; then
	osascript -e 'on run argv' -e 'display notification "CorrectCode: " & item 1 of argv' -e 'end run' "You missed an action.addToStore";
	afplay -v 4 $soundLib/Submarine.aiff
elif [[ $1 == "CompileError" ]]; then
	osascript -e 'on run argv' -e 'display notification "FailedCompile:" & item 1 of argv' -e 'end run' "CompileError";
	afplay -v 1 $soundLib/Sosumi.aiff

elif [[ $1 == 'Success' ]]; then
	afplay -v 0.5 $soundLib/Glass.aiff
fi


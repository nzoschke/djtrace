exports.midiIO = [
  {
    // Generic MIDI Output Device defined in djtrace.tsi
    name: "djtrace.js",
    port: "djtrace.js",
    channels: {
      183: {                                            // Ch08 in Traktor Controller Manager
        2:    ["Deck A High Adjust",    "Deck A Mix"],  // 0-127 sliders
        3:    ["Deck A Mid Adjust",     "Deck A Mix"],
        4:    ["Deck A Low Adjust",     "Deck A Mix"],
        5:    ["Deck A Volume Adjust",  "Deck A Mix"],
        6:    ["Deck A Monitor Cue",    "Deck A Cue"],  // [0,127] toggle

        8:    ["Deck B High Adjust",    "Deck B Mix"],
        9:    ["Deck B Mid Adjust",     "Deck B Mix"],
        10:   ["Deck B Low Adjust",     "Deck B Mix"],
        11:   ["Deck B Volume Adjust",  "Deck B Mix"],
        12:   ["Deck B Monitor Cue",    "Deck B Cue"],

        13:   ["Deck C High Adjust",    "Deck C Mix"],
        14:   ["Deck C Mid Adjust",     "Deck C Mix"],
        15:   ["Deck C Low Adjust",     "Deck C Mix"],
        16:   ["Deck C Volume Adjust",  "Deck C Mix"],
        17:   ["Deck C Monitor Cue",    "Deck C Cue"],

        18:   ["Deck D High Adjust",    "Deck D Mix"],
        19:   ["Deck D Mid Adjust",     "Deck D Mix"],
        20:   ["Deck D Low Adjust",     "Deck D Mix"],
        21:   ["Deck D Volume Adjust",  "Deck D Mix"],
        22:   ["Deck D Monitor Cue",    "Deck D Cue"],

        23:   ["X-Fader",               "Cross Fader"],

        103:  ["Deck A Is Loaded",      "Deck A Load"],  // [0,127] toggle
        104:  ["Deck B Is Loaded",      "Deck B Load"],
        105:  ["Deck C Is Loaded",      "Deck C Load"],
        106:  ["Deck D Is Loaded",      "Deck D Load"],

        107:  ["Deck A Seek Position",  "Deck A Pos"],
        108:  ["Deck B Seek Position",  "Deck B Pos"],
        109:  ["Deck C Seek Position",  "Deck C Pos"],
        110:  ["Deck D Seek Position",  "Deck D Pos"],
      }
    }
  },
  {
    // Denon DN-X1600 in Layer Mode
    // http://www.dm-pro.eu/DocumentMaster/en/DN-X1600_manual_en.pdf
    // Page 20
    name: "USB MIDI Device Port 1",               // TODO: Require explicit rename in "Audio MIDI Setup"?
    port: 0,
    channels: {
      176: {                                      // 0xBn in manual
        2:    ["CH1 EQ HIGH VR",  "Deck C Mix"],  // 0-127 sliders
        3:    ["CH1 EQ MID VR",   "Deck C Mix"],
        4:    ["CH1 EQ LOW VR",   "Deck C Mix"],
        5:    ["CH1 FADER",       "Deck C Mix"],
        0:    ["CH1 CUE",         "Deck C Cue"],  // TODO: Number: 0x01; Command: SW ON : 0x9n／SW OFF : 0x8n

        8:    ["CH2 EQ HIGH VR",  "Deck A Mix"],
        9:    ["CH2 EQ MID VR",   "Deck A Mix"],
        10:   ["CH2 EQ LOW VR",   "Deck A Mix"],
        11:   ["CH2 FADER",       "Deck A Mix"],
        0:    ["CH2 CUE",         "Deck A Cue"],

        13:   ["CH3 EQ HIGH VR",  "Deck B Mix"],
        14:   ["CH3 EQ MID VR",   "Deck B Mix"],
        15:   ["CH3 EQ LOW VR",   "Deck B Mix"],
        16:   ["CH3 FADER",       "Deck B Mix"],
        0:    ["CH3 CUE",         "Deck B Cue"],

        18:   ["CH4 EQ HIGH VR",  "Deck D Mix"],
        19:   ["CH4 EQ MID VR",   "Deck D Mix"],
        20:   ["CH4 EQ LOW VR",   "Deck D Mix"],
        21:   ["CH4 FADER",       "Deck D Mix"],
        0:    ["CH4 CUE",         "Deck D Cue"],

        22:   ["CROSS FADER",     "Cross Fader"],
      }
    }
  },
]
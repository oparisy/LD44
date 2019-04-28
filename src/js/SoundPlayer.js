
/* eslint no-undef: "off" */
/* eslint no-unmodified-loop-condition: "off" */
/* eslint no-return-assign: "off" */
/* eslint no-sequences: "off" */
/* eslint brace-style: "off" */
/* eslint camelcase: "off" */

let Z, z, F, f, X, R, r

// ZzFX - MIT License - Copyright (c) 2019 - Frank Force
Z = // play a sound with full parameter control
(
  frequency, // float frequency of note, 1 is ~ 2000 hz
  length, // int length of sample, 1e5 is max (about 1 second)
  noise, // int distortion amount, 0 is none
  attack, // int how long to fade in before fading out
  modulation, // float modulation frequency (warble), 0 is none
  modulationPhase // float phase of modualtion (sine wave offset)
) => {
  // build the sample
  for (X = [], F = f = 0; ++F < length; f += 1 + R(noise)) // noise
  {
    X[F] = Math.cos(f * frequency * // frequency
            Math.cos(f * modulation + modulationPhase)) * // modulation
            (F < attack ? F / attack // attack
              : 1 - (F - attack) / (length - attack)) // decay
  }

  // create a buffer and play it
  F = ZzFX_context.createBuffer(1, 1e5, 1e5)
  F.getChannelData(0).set(X)
  X = ZzFX_context.createBufferSource()
  X.buffer = F
  X.connect(ZzFX_context.destination)
  X.start()
}
z = seed => // play sound from a seed
{
  X = R(5e3) // tiny bit of frequency randomness
  let s = r // save rand seed
  r = seed // set our seed
  R(); R() // warm it up first (so low seeds sound good)

  // play seeded sound
  Z(
    (R(1e5) + X) / 1e6, // frequency
    f = R(1e5), // length
    R(9), // noise
    R(f), // attack
    R(1e5) / 1e9, // modulation frequency
    R(1e5) // modulation phase
  )

  r = s // restore rand seed
}
R = max => // random numbers, beween 0, and 1 less then max
  (r ^= r << 3, r ^= r >> 2, max ? r % max : 0)
var ZzFX_context = new AudioContext() // shared audio context (prevents running out)
r = Date.now() // starting used by random number generator

class SoundPlayer {
  play (seed) {
    z(seed)
  }
}

export { SoundPlayer }

const axios = require('axios')

/**
 * @typedef RadarValues
 * @type {object}
 * @property {number} jumps
 * @property {number} rolls
 * @property {number} lifts
 * @property {number} fakes
 * @property {number} mines
 * @property {number} hands
 * @property {number} holds
 */

/**
 * @typedef AllScores_TapNoteData
 * @type {object}
 * @property {number} TapNoteScore_Held
 * @property {number} TapNoteScore_HitMine
 * @property {number} TapNoteScore_Miss
 * @property {number} TapNoteScore_MissedHold
 * @property {number} TapNoteScore_W1
 * @property {number} TapNoteScore_W2
 * @property {number} TapNoteScore_W3
 */

/**
 * @typedef AllScores_Score
 * @type {object}
 * @property {string} artist - The song artist.
 * @property {string} date - Date of which the score was submitted. Ex: 2023-08-01T19:45:38
 * @property {number} dp_actual
 * @property {number} dp_max
 * @property {number} id - The id of the score.
 * @property {number} meter - The meter of this score song difficulty.
 * @property {string} modifiers - Modifiers used for this score. Ex: LifeTime, 4x, Reverse, FailImmediate, Overhead
 * @property {RadarValues} radar_values
 * @property {number} rate - The rate of which the song was played for this score.
 * @property {number} score - Ranges from 0 to 1.00000
 * @property {AllScores_TapNoteData} tapnote_data
 * @property {string} title - The title of the song
 * @property {string} username - The name of the user who made this score.
 */

/**
 * @typedef {"novice" | "easy" | "medium" | "hard" | "expert" | "edit"} ScoreDifficulty
 */

/**
 * @typedef AllScores_RequestOptions
 * @type {object}
 * @property {import('./types.d.ts').Mode} [mode] - The mode you want to collect scores from.
 * @property {import('./types.d.ts').StylesMap[import('./types.d.ts').Mode]} [style] - The style you want to collect scores from.
 * @property {Array<import('./types.d.ts').Difficulty> | import('./types.d.ts').Difficulty} [difficulty] - The difficulty you want to collect scores from.
 * @property {string} [username] - The author you want to collect scores from.
 * @property {string} [scoreType]
 * @property {number} [limit] - The limit of scores to return.
 */

/**
 * @typedef {"D" | "C-" | "C" | "C+" | "B-" | "B" | "B+" | "A-" | "A" | "A+" | "S-" | "S" | "S+" | "*" | "**" | "***" | "****"} ScoreGrade
 */

class OFline {
  class() {}

  get chartKeys() {
    return {
      v1: {
        'After The Ending': {
          dance: {
            expert: [
              {
                by: 'Snil',
                key: 'Xb426b85acea6cb815607bfbcb5ddf7ba555d9d69',
              },
              {
                by: "Marukomuru",
                key: "X42c9cf8fc949e17cb598e41c16dcbf07f11a1471",
                style: "double"
              }
            ],
            hard: [
              {
                by: 'Homeee',
                key: 'X860df41b3e6de36bbf48bee3a6817709c03e9904',
              },
              {
                by: "Marukomuru",
                key: "Xc8fb65f4d37f55feab6ddf2f0392bf58d8a744d0",
                style: "double"
              }
            ],
            medium: [
              {
                by: 'Homeee',
                key: 'X7f5376e641b82093cc4dd5e82ba40e89a493c9d5'
              },
              {
                by: "Marukomuru",
                key: "X2a768f7c0dda97946053999d84b539d5ef7db038",
                style: "double"
              }  
            ],
            easy: [
              {
                by: "Homeee",
                key: 'X401562a587cac5e585283e466426f4f4195ffe70'
              },
              {
                by: "Marukomuru",
                key: "X2bccaaf7b5dec256ef672d78805bf9acc0d0fa33",
                style: "double"
              }
            ],
            novice: {
              by: "Homeee",
              key: 'X027c7af3381a8780e546584abbbcd2f3b635c4ad'
            }
          }
        },
        'Conflicting Revenge': {
          dance: {
            edit: [
              {
                by: 'Marukomuru',
                key: 'X0b64d9005dc2676cf8c285d864822c5c251fff90',
              },
              {
                by: "Marukomuru",
                key: "X584e563625643ecedbeab14232cba74a038c43d8",
                style: "double"
              }
            ],
            expert: [
              {
                by: 'Marukomuru',
                key: 'X3485c2d0b54006f165ce8381531688a8b8017040',
              },
              {
                by: "Marukomuru",
                key: "X06fb6079921bedf7d2810aac9fdc886701894424",
                style: "double"
              }
            ],
            hard: [
              {
                by: "Marukomuru",
                key: "Xf85aff679ea526e24f0c167cc1a4cb69eb13bf60"
              },
              {
                by: "Marukomuru",
                key: "X52ad52a9c72f4cd6d585f63c185752e172f5b9e4",
                style: "double"
              }
            ],
            medium: [
              {
                by: "Marukomuru",
                key: "X346a795a901bb6913e7a62106b2a4bfe82469ddd"
              },
              {
                by: "Marukomuru",
                key: "Xde0ca89c3dd3bef10ee569a2a515612fa971dc29",
                style: "double"
              }
            ],
            easy: [
              {
                by: "Marukomuru",
                key: "Xa16a2eb478cfe2fa2fa3fb879ad551627e363a80"
              },
              {
                by: "Marukomuru",
                key: "X1b740afbf676b5fa82fec2ee5840cfd5921994f5",
                style: "double"
              }
            ],
            novice: [
              {
                by: "Marukomuru",
                key: "X52ffdbd81bee53d8c9e05ae62dc177a272bb82dc"
              },
              {
                by: "Marukomuru",
                key: "X1a023dfa8c84c9feff8bd335cfa6c5a9a597b2b7",
                style: "double"
              }
            ]
          }
        },
        'Tagebuch der vergangenen Erinnerungen': {
          dance: {
            expert: {
              by: 'Marukomuru',
              key: 'X16857bd559f61ca51fb636f54369be3a6de2b84d',
            },
            hard: {
              by: "-YOSEFU-",
              key: "X19e3fe5756539f6b5fd4999083ea8e9554e810f9"
            },
            medium: {
              by: "Chriszo",
              key: "X8925c724497daca728563346dca5eecf7d164308"
            },
            easy: {
              by: "Chriszo",
              key: "Xf4edfa901fe70216aa5b4b89714c094d0f86491d"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X41b9ee1c5c752b24a90785590f78fb90ca4a7d13"
              },
              {
                by: "Marukomuru",
                key: "X7102b4c2dd8724c48a95cd6a8be7c7ca194fe707",
                style: "double"
              }
            ]
          },
        },
        "Umi's Secret": {
          dance: {
            hard: {
              by: '-YOSEFU-',
              key: 'X2ec21e91a5cb074ed3e2239df7483870e62fe658',
            },
            medium: {
              by: "Daniel Rotwind",
              key: "X41165f606235aadd426d6eabbd6b8720e5828bbf"
            },
            easy: {
              by: "Daniel Rotwind",
              key: "X2058705438fc52a64b803b24bdd019b10cda3040"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X494de2b9040c1f150c3ad0e40b873758c2e6d176"
              },
              {
                by: "Marukomuru",
                key: "Xf4abe68075b8df3bddf01c073410a1a041ba536b",
                style: "double"
              }
            ]
            // TODO: Add 3panel charts by -YOSEFU-
          },
        },
        'brokenHeart resurrection ~estelle~': {
          dance: {
            expert: [
              {
                by: 'Telperion',
                key: 'X91e8444f0fcac042c211ffabea63777c2442327a',
              },
              {
                by: "Marukomuru",
                key: "X8c15b7c47abf574d8e0af9325072a8588753b350",
                style: "double"
              }  
            ],
            hard: [
              {
                by: ['A Dancing Maractus', '-YOSEFU-'],
                key: 'X3bcce3f75e5ff57bd631a1a5d629fb1168dd9a6d',
              },
              {
                by: "Marukomuru",
                key: "X40d72e86830913cd8aa6f375a6c7a1a08137e0a6",
                style: "double"
              }
            ],
            medium: [
              {
                by: "-YOSEFU-",
                key: "X7797b3e50bb52b69333ec6b84995da91765feba4"
              },
              {
                by: "Marukomuru",
                key: "Xdf10312546bb6802ca2e8569458ed68b28258df9",
                style: "double"
              }
            ],
            easy: [
              {
                by: "48productions",
                key: "X2fcdc5fc5f3762b628bde520b6bc26f77970c2e5"
              },
              {
                by: "Marukomuru",
                key: "X651dadfdbb9a65d977140ee9b27aeefce6e26ec6",
                style: "double"
              }
            ],
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X256d354cc771197c6cd61c965e62a77f0ea8c9af"
              },
              {
                by: "Marukomuru",
                key: "X79d2cf00cca15d007d32a6a7aae712479c807ecd",
                style: "double"
              }
            ],
            edit: {
              by: "Marukomuru",
              key: "Xfdaa6190a1c792e7e78c7b4335233aef02dfbf44",
              style: "double"
            }
          },
        },
        'Nexen II': {
          dance: {
            expert: {
              by: '-YOSEFU-',
              key: 'X495cd1a8396cd69b82b15be0216e0b6460a1aadb',
            },
            hard: {
              by: "-YOSEFU-",
              key: "Xf5523024b0f110d653c4a4dada21446c95157bb2"
            },
            medium: {
              by: "Jack5",
              key: "Xcbdd43e2b8ef4ea648a7cd2dcf1ed93c0c5f384c"
            },
            easy: [
              {
                by: "Jack5",
                key: "Xefafaa32e1d1956fb2c2bc26988f0bec27e8a6b0"
              },
              {
                by: "Marukomuru",
                key: "X9b24243ee5511a97c28f5c32da535d0f42a23234",
                style: "double"
              }
            ],
            novice: [
              {
                by: "Jack5",
                key: "Xcbab6402d60d5cebe82726a0adb3d85a26e4d136"
              },
              {
                by: "Marukomuru",
                key: "Xd3e63a9cfdf934bc996edb879cab27ed4d7de1a2",
                style: "double"
              }
            ]
          },
        },
        'Let Me See You': {
          dance: {
            expert: {
              by: ['Jose_Varela', 'A Dancing Maractus'],
              key: 'X5783d4620011e86ce9b71804c2598d01ba00dc8f',
            },
            hard: {
              by: "A Dancing Maractus",
              key: "Xec82ca1ca478218d1eb2e9af5a3dd0c336f23552"
            },
            medium: [
              {
                by: "A Dancing Maractus",
                key: "Xd19b5540757f02a4cae655a444014380655dfb20"
              },
              {
                by: "Daniel Rotwind",
                key: "X29e0008bb788b39bc1b9a24a740f83ad85a544fc"
              }
            ],
            easy: {
              by: "48productions",
              key: "X85470361fcc687cc8b7c9692a02c993caa7e48fb"
            },
            novice: [
              {
                by: "48productions",
                key: "X57aa1f16238051f38c262715a10dcbc17be807f1"
              },
              {
                by: "Marukomuru",
                key: "Xc33ba402d871db2964fcbe990250c5ae1347d29e",
                style: "double"
              }
            ]
          },
        },
        Broken: {
          dance: {
            edit: {
              by: 'A Dancing Maractus',
              key: 'Xbaa1b502ec3d31b0b3d67f45acdf716957a0a390',
            },
            expert: {
              by: 'A Dancing Maractus',
              key: 'X8c2fcfbe83ba8ca1db7b84358513450b16fa824a',
            },
            hard: [
              {
                by: "A Dancing Maractus",
                key: "X0b78b03e44d45683d60e6f06afb96870d6b9701f"
              },
              {
                by: "Chriszo",
                key: "X5e2674623b32a7e6a854287c6c0cd6530569f02b",
                style: "double"
              }
            ],
            medium: [
              {
                by: "Daniel Rotwind",
                key: "X2bd543a627fbfa93b9041f08e3c1ed607f1f369a"
              },
              {
                by: "Chriszo",
                key: "Xa2a4b50f70933a3ce110be15a1adcadd3f41b5cb",
                style: "double"
              }
            ],
            easy: [
              {
                by: "48productions",
                key: "X5adc99ffca1e5461901e6da3562edc1f50839495"
              },
              {
                by: "Chriszo",
                key: "X6f9ddf00a474a5dde33fe1384e37c1370606ed69",
                style: "double"
              }
            ],
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X2bfb39b7f24a3230152b3c2347f5a421d72e4f24"
              },
              {
                by: "Chriszo",
                key: "Xa6c5aebcc4a7084ae6881a01a51f12bddf60bfa9",
                style: "double"
              }
            ]
          },
        },
        'Low End Theory': {
          dance: {
            expert: {
              by: 'A Dancing Maractus',
              key: 'X9eccd7ef3e8e72c59a248f55048fa94c24996358',
            },
            hard: {
              by: "A Dancing Maractus",
              key: "X7a16a8b1c8c64e75a27a5895f5f2234fe74705d3"
            },
            medium: {
              by: "48productions",
              key: "X1032b3b962aa559c1fe93f1cf02466c93adbdde6"
            },
            easy: {
              by: "Daniel Rotwind",
              key: "Xd0c48682fb7bf1d999bf54f1ddade939954a1b8f"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "Xd744ed1a67abc482a4c7afb492cfe27c5ace40ba"
              },
              {
                by: "Marukomuru",
                key: "X52fe90af714e55d77312849bb7cf55fd9c0be648",
                style: "double"
              }
            ]
          }
        },
        Heartbeat: {
          smx: {
            hard: {
              by: 'K.TURN',
              key: 'Xaf91eee16516ae86e501f2a9abb369128f05f4b1',
            },
          },
          dance: {
            edit: {
              by: "Gr00txD",
              key: "Xdb0dfe2b5c7ff000913e1165c05e21bb3db0d80b"
            },
            expert: [
              {
                by: 'Gr00txD',
                key: 'Xdb0dfe2b5c7ff000913e1165c05e21bb3db0d80b',
              },
              {
                by: "Marukomuru",
                key: "X62d730c4776f77092213c4392ee9f06cc7d4ac35",
                style: "double"
              }
            ],
            hard: [
              {
                by: 'Gr00txD',
                key: "Xe417d8d55722cdeb2f2cf419c352553a61182e2d"
              },
              {
                by: "Chriszo",
                key: "X84e2074e2432aceedb659b30563a4d132d9d59c3"
              },
              {
                by: "Chriszo",
                key: "X35f75e2a1266e200b0a254d47cd68c529db271d8",
                style: "double"
              }
            ],
            medium: [
              {
                by: "Gr00txD",
                key: "X65b2fecd623746d6fcb292d261dd9d2b46f044ca"
              },
              {
                by: "Chriszo",
                key: "X0cb21608e01389d297b7f221e1fc1f02098be931"
              },
              {
                by: "Chriszo",
                key: "X213d098229e77f878c2fbda3bc98c3e59c60a39e",
                style: "double"
              }
            ],
            easy: [
              {
                by: "Gr00txD",
                key: "X140c5502f63db18d7878d9315d165ee060ecd3ee"
              },
              {
                by: "Chriszo",
                key: "X0691111ff01c177fb448affc118bbeee6e68ccc1"
              }
            ],
            novice: [
              {
                by: "Gr00txD",
                key: "Xef3c096cc07bafd25d4acaa82cc886ca08ee32d1"
              },
              {
                by: "Chriszo",
                key: "Xc4ec86b7aa7fe22c54d985dceccc67017d121379"
              },
              {
                by: "Chriszo",
                key: "X42db7fc6125b433997180668103368a88766153e",
                style: "double"
              }
            ]
          }
        },
        Plasma: {
          dance: {
            hard: [
              {
                by: '48productions',
                key: 'Xb360f78b65e3bec885cb2c92d8f18446c6182dc3',
              },
              {
                by: "Marukomuru",
                key: "X2deb4db3b8d9fc25c1db5a069b75444f09440174",
                style: "double"
              }
            ],
            medium: [
              {
                by: "Chriszo",
                key: "X6ca279a5daee98b3172faae222af6d571e01fd57"
              },
              {
                by: "Marukomuru",
                key: "Xfa204ae087e37c909f082c256af57f7dcb8a010a",
                style: "double"
              }
            ],
            easy: [
              {
                by: "Chriszo",
                key: "X4d016d30b1df40acdb0fbcbda64e274dca998917"
              },
              {
                by: "Daniel Rotwind",
                key: "Xe7da635456b9731b72d1f09bd97d1242770ff2ec"
              },
              {
                by: "Marukomuru",
                key: "Xdd4e06285a738061d45091e15934c76a904ad646",
                style: "double"
              }
            ],
            novice: [
              {
                by: "48productions",
                key: "Xce64461dd5ead714f68bdf0bf3abace6a1c31673"
              },
              {
                by: "Marukomuru",
                key: "X0404511fc164ce93d8e90a7aed0490ea9f393ec5",
                style: "double"
              }
            ],
            expert: {
              by: "Marukomuru",
              key: "X7a5ea531f533092b71ec1766e331429c0f5b07f7",
              style: "double"
            }
          },
        },
        'Abandoned Doll': {
          dance: {
            expert: [
              {
                by: 'Drazil',
                key: 'Xb75761ae09497733b1a03da35ee22d1622932103',
              },
              {
                by: "Marukomuru",
                key: "X17addeedd6355ed4d0cbe963cf1eed94bfb56bb0",
                style: "double"
              }
            ],
            hard: [
              {
                by: "48productions",
                key: "X189f6d85c92337125780171c5346ab3dff2ae98f"
              },
              {
                by: "Marukomuru",
                key: "X2e33f9ecaad6902503cb37ceb18da33eefba2e5e",
                style: "double"
              }
            ],
            medium: [
              {
                by: "48productions",
                key: "Xb320c15b97d26af4ef7b5a6f8ad4709d9f396e74"
              },
              {
                by: "Marukomuru",
                key: "X1638411fdfe7e304de5df9108e1af763a557516b",
                style: "double"
              }
            ],
            easy: [
              {
                by: "48productions",
                key: "X0bda8d1859b70896304a4c8a06a5c0d01a6006dd"
              },
              {
                by: "Marukomuru",
                key: "X91bfc366ca0afb2a686acfe7032818bfe7e8acd0",
                style: "double"
              }
            ],
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X769bd147b3bd0f66f0169f56144f4a735df21219"
              },
              {
                by: "Marukomuru",
                key: "X4a892ea20e7d1cb8d6de5aed23ecd6eb495f5999",
                style: "double"
              }
            ],
          }
        },
        'synthborn lovebirds': {
          dance: {
            expert: {
              by: 'Drazil',
              key: 'Xc4af6a3ed356491cd9e5e894dda08204efc0c410',
            },
            hard: {
              by: "Drazil",
              key: "X8af6b88837203e6c1a8277c5d479b33976bef2e4"
            },
            easy: {
              by: "Daniel Rotwind",
              key: "X75346e1eb30390caceebbf4ff8bb493baa5aa271"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X585c6bde4091482fc83ae8a0f61afbebd22d12fc"
              },
              {
                by: "Marukomuru",
                key: "X07cbc9c3ff88136d9c986821da5505a8b3212dc7",
                style: "double"
              }
            ]
          }
        },
        'Some Things Must': {
          dance: {
            expert: {
              by: 'Sudospective',
              key: 'Xec134c357ebc87e149f0931eaa2b2659001b1489',
            },
            hard: {
              by: "-YOSEFU-",
              key: "X9b6fb9980ff990d3a2a97c85e1b41b80c6b8bb87"
            },
            medium: {
              by: "-YOSEFU-",
              key: "X46cb0e52e58c33e6fa20eb41ff8a7bc00070a99a"
            },
            easy: {
              by: "Sevish",
              key: "X4f5f2230552fd43fb089885cb4fcfa9e3b4a1e5c"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X9ce2de08b90fd95412fe145f6a592bc093103b32"
              },
              {
                by: "Marukomuru",
                key: "X0c5badc030ab42eb2da1239a9f8a567b08cda20a",
                style: "double"
              }
            ]
          }
        },
      },
      v2: {
        'Into My Dream': {
          dance: {
            expert: {
              by: '-YOSEFU-',
              key: 'X8f90b30d22937af04ab915010d38f7de4566ac89',
            },
            hard: {
              by: "-YOSEFU-",
              key: "X99e98ff304e29dda13e3cfb55bbca57b02f836ba"
            },
            medium: {
              by: "48productions",
              key: "X8dd38ede01e91ce196b22b5eac440160dc1d11f1"
            },
            easy: {
              by: "48productions",
              key: "Xc5862914828e2350e7bc1caa599f760a4d9fed04"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "Xb67bbd10951ce4a4d495e884473c6a21236d3ba3"
              },
              {
                by: "48productions",
                key: "X2c6a0504b73991c9db8696710d0930d475280d3c"
              },
              {
                by: "Marukomuru",
                key: "Xa277842da06234d21db10ec0e0461c30bdcdf862",
                style: "double"
              }
            ],
          },
          smx: {
            expert: {
              by: 'K.TURN',
              key: 'X3fac80f3c0bbc88c4b1081ac36c8631d7cc1b660',
            },
          },
        },
        'B-Happy': {
          dance: {
            edit: {
              by: '-YOSEFU-',
              key: 'X429d1b41032994bebc915f2668a04de7f90f69dd',
            },
            hard: {
              by: "-YOSEFU-",
              key: "X9ea2ce2d3ffdf82b5e75bc8de2f1919cba81d0bc"
            },
            medium: {
              by: "-YOSEFU-",
              key: "Xc39c9669eba7ad16017575878ef3ebbdbc75c79e"
            },
            easy: {
              by: "-YOSEFU-",
              key: "Xfc63b3865ffed5f9896134c3443f1574fe26a215"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "Xf2e9b5fe48d3a8a5e2310ff14a82f4cceae25c5f"
              },
              {
                by: "Marukomuru",
                key: "X52c9c0ff88a5981185fd4481b9660120fdfce418",
                style: "double"
              }
            ]
          },
        },
        'chop chop': {
          dance: {
            expert: {
              by: '-YOSEFU-',
              key: 'X5283329f39657b2c612fec3bfb633837c4892f81',
            },
            hard: {
              by: "-YOSEFU-",
              key: "X2d59383661a675a6b24367b762e6768610b44841"
            },
            medium: {
              by: "Chriszo",
              key: "X79e5d61dae892c0b79adfe71f7e7721f59633450"
            },
            easy: [
              {
                by: "Chriszo",
                key: "X02d31187e45626a34370a7ed93ce14f1e6fb3040"
              },
              {
                by: "Daniel Rotwind",
                key: "Xa1dd438e1c4aecd7d6037cf83b664adaab05d25a"
              }
            ],
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X7d9f005a597653b9a5f3c5484c136e2091f0bb4c"
              },
              {
                by: "Marukomuru",
                key: "X1d458f0e5da9009efd3a28541efe533121f4fe7c",
                style: "double"
              }
            ]
          },
        },
        'Bounded Quietude': {
          dance: {
            expert: {
              by: '-YOSEFU-',
              key: 'X64564b328f619327a4258dda14b0ecbc322e8635',
            },
            hard: {
              by: "-YOSEFU-",
              key: "Xc9f7fa6be6806025c8d87d82b5bfa014b81ceb19"
            },
            medium: {
              by: "-YOSEFU-",
              key: "Xca9f978302b7edf9a3068edb321e1cc42209d4b3"
            },
            easy: [
              {
                by: "-YOSEFU-",
                key: "Xea997427a8801858ebc55f1c7d3f25681098a1a6"
              },
              {
                by: "Marukomuru",
                key: "X732ae87120a4bd4bf92a0ff4d4f786c64cec9d07",
                style: "double"
              }
            ],
            novice: [
              {
                by: "-YOSEFU-",
                key: "X9d2651495b5a98f4f142614b65848e9778131344"
              },
              {
                by: "Marukomuru",
                key: "Xde898a609fb1b6cd63cbe2366fd5f366f369c271",
                style: "double"
              }
            ]
          }
        },
        Beatucada: {
          dance: {
            expert: {
              by: 'Timo Kitsune',
              key: 'Xb53ea3b661ae0ec6df3f13d1f96184ef25c02722',
            },
            hard: {
              by: 'Chriszo',
              key: 'X70c3916342b9ae28b3162c1c4599f78b2992cdb1',
            },
            medium: {
              by: "Timo Kitsune",
              key: "Xfa559ed7066fe31ca9bb180e97801000955733bd"
            },
            easy: {
              by: "Timo Kitsune",
              key: "X042b49ce9443798c3562b8b387374b95c4c9ee66"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X3ff4b64f38a34304a7524df3dca0773cacb5ced2"
              },
              {
                by: "Marukomuru",
                key: "X830864a6c39ee288c1fe4fdf49b17fd5a75af819",
                style: "double"
              }
            ]
          },
        },
        Halcyon: {
          dance: {
            hard: [
              {
                by: 'Rippy Ripster',
                key: 'X8b15dc0bf3762cff8bb4c558f7e8de564fd47664',
              },
              {
                by: "Marukomuru",
                key: "X666787660f529be80b15d850c4c044dbb9aa5aff",
                style: "double"
              }
            ],
            novice: [
              {
                by: "Daniel Rotwind",
                key: "Xb7420bce84c36eb655ff4188b411a31b9e44c9c3"
              },
              {
                by: "Marukomuru",
                key: "X5f09099b21873410db3fb3e938a6331e11175a3e",
                style: "double"
              }
            ],
            easy: [
              {
                by: "Marukomuru",
                key: "X4ba1c5db37f71acbc4d650a645f554f414b3824b",
                style: "double"
              },
              {
                by: "Marukomuru",
                key: "X60a6323fe0dd18ce47686757b302c99408fa5e69",
                style: "double"
              }
            ],
            medium: {
              by: "Marukomuru",
              key: "X9fc51ea585a7d2ce1c181a17f6b4e80d52a217ce",
              style: "double"
            },
            expert: {
              by: "PCBoyGames",
              key: "X8e6f3e1f701bb8c410b1b241751c04065e1750bb",
              style: "double"
            },
            edit: {
              by: "Marukomuru",
              key: "X06f5493ed30ee68aacd34cbf2460167c9adc2e59",
              style: "double"
            }
          },
        },
        'Relaxation Piece of Conclusion': {
          pump: {
            expert: {
              by: "Rippy Ripster",
              key: "X457f02e61881d2eb846998d98d89257022ffd1f8"
            },
            hard: {
              by: "Rippy Ripster",
              key: "Xb17dbdc0e00ca307307ff0dceb9e5727c010fb46"
            },
            medium: {
              by: "Rippy Ripster",
              key: "X6dabad10be83431531a0ace0bb64355e732a104d"
            },
            easy: {
              by: "Rippy Ripster",
              key: "X4dc869fa157e58d5d583e5eee52311f0a6271209"
            },
            novice: [
              {
                by: "Rippy Ripster",
                key: "Xb7abd7ddcb3b054034c77677d187e0c8032d4f61"
              },
              {
                by: 'Daniel Rotwind',
                key: 'X9b493548a46508e4c31efed57abb5efa2b04a615',
              },
              {
                by: "Marukomuru",
                key: "X3782d87ede71e2ac497ac17f7df76e1d46be1124",
                style: "double"
              }
            ]
          }
        },
        'CRUSH THE DEVIL (IN MY BRAIN)': {
          dance: {
            hard: {
              by: '-YOSEFU-',
              key: 'Xdd9a9e080b6bcebc3fd02a31f7ab1a90ccf2bffd',
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "Xfa9d317fc5965eb0b7712cd9d4aa48ec627fa3e4"
              },
              {
                by: "Marukomuru",
                key: "X72a92e55f930015bb6574eaa4b0705c99555e1e9",
                style: "double"
              }
            ]
          }
        },
        'Summer Overload!': {
          dance: {
            expert: {
              by: '-YOSEFU-',
              key: 'Xf505b690d488ab942975d9e1b4a19bbf5374224d',
            },
            hard: [
              {
                by: "Daniel Rotwind",
                key: "Xec2b1120f226ea3aa7f20cf9e0a96465d7be7721"
              },
              {
                by: "48productions",
                key: "X4bfceecfd377ed6ae1e7b982f3f45c79cef5708f"
              }
            ],
            medium: [
              {
                by: "Daniel Rotwind",
                key: "X0554906f8e4b3dddb24b286ea2af48152d1e7f55"
              },
              {
                by: "Rippy Ripster",
                key: "Xd25e063b71f94f567113665472711988cbacec56",
                style: "double"
              }
            ],
            easy: [
              {
                by: "Rippy Ripster",
                key: "X3f5bf28ad991687b99af0833580b17703f19eec9"
              },
              {
                by: "Rippy Ripster",
                key: "X812ae48f188f916e4c92c026c50d0d8c493c77e1",
                style: "double"
              }
            ],
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X3e542735d16429da7e26c5f9ece5a16d22705476"
              },
              {
                by: "Marukomuru",
                key: "Xc1a5af87e52d48f72004aa1424657102d81e6f45",
                style: "double"
              }
            ],
          }
        },
        Neutralize: {
          dance: {
            expert: {
              by: "-YOSEFU-",
              key: "X28b4164885a145a455b0c4040a9b75c571b191d2"
            },
            hard: {
              by: "-YOSEFU-",
              key: "X80f26c51c276d0d9226cab2b5e31b5c7ae66b3aa"
            },
            medium: {
              by: "-YOSEFU-",
              key: "Xd8053fefc1ef29abab40a6a5c84332e763e20851"
            },
            easy: [
              {
                by: "Daniel Rotwind",
                key: "Xf105f7fa2d812705661a2812936afa4eb7c3570f"
              },
              {
                by: "Marukomuru",
                key: "X050d5ef569377acc2c05d0fb459b0dd54daf8ee3",
                style: "double"
              }
            ],
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X30e74a83a1deeaf6ac35be7980eb74f6f12aa9dc"
              },
              {
                by: "Marukomuru",
                key: "Xede490f7a8ea6fdb8a4276a20a6880ec6685e975",
                style: "double"
              }
            ]
          }
        },
        Phycietiia: {
          dance: {
            edit: {
              by: "-YOSEFU-",
              key: "X33a82acbc03fabef5ce9e95040e3b3dac35e2c07"
            },
            expert: {
              by: "-YOSEFU-",
              key: "X63bf933712b6e4e3d4847132d925355e370a3f3f"
            },
            hard: [
              {
                by: "Daniel Rotwind",
                key: "X823c5d27fc821a62826fb8c6c07593a9a0c3c81f"
              },
              {
                by: "Chriszo",
                key: "Xc559bdc75a3ce476a8fbf1cb9352e11ecb4a69b0"
              }
            ],
            medium: {
              by: "Chriszo",
              key: "X044a0e1f69f7f8d29781cf0a41a9ce0b7934444b"
            },
            easy: {
              by: "Chriszo",
              key: "Xe018b174b66f7cf4afd824c45039b09c46a2f620"
            },
            novice: [
              {
                by: "Chriszo",
                key: "Xcdb138dedcec2b7c75f4792391e82096042fbb97"
              },
              {
                by: "Marukomuru",
                key: "Xc6d8a1afbd13f4bffed8c11e49493e563a538182",
                style: "double"
              }
            ]
          }
        },
        Sweetners: {
          dance: {
            hard: {
              by: ["Jack5", "Daniel Rotwind"],
              key: "X30fb59ff61aaba33926fe598419d120912742d0f"
            },
            medium: {
              by: ["Jack5", "Daniel Rotwind"],
              key: "X64ba1152125fe0cf7571ce937a7262b4fc048667"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "Xe0156ce00b54a14e9fa262fb5539f8a605ba4fca"
              },
              {
                by: "Marukomuru",
                key: "X39b8bc047e1f434d7dbd9b07f5bede07b1a8d04a",
                style: "double"
              }
            ]
          }
        },
        'Technological ≠ Emotional': {
          dance: {
            expert: {
              by: "-YOSEFU-",
              key: "Xe0f626f9aaafcbb8c3e18a19502a94cb474d8656"
            },
            novice: [
              {
                by: "Daniel Rotwind",
                key: "X7d9a31af111a834322e3f3caceca97bf18c94e9f"
              },
              {
                by: "Marukomuru",
                key: "X247894ffa0539ed02208ee2430d6837a7668ec7d",
                style: "double"
              }
            ]
          }
        }
      },
    }
  }

  get grades() {
    return {
      GradePercentTier01: 1.0,
      GradePercentTier02: 0.99,
      GradePercentTier03: 0.98,
      GradePercentTier04: 0.96,
      GradePercentTier05: 0.94,
      GradePercentTier06: 0.92,
      GradePercentTier07: 0.89,
      GradePercentTier08: 0.86,
      GradePercentTier09: 0.83,
      GradePercentTier10: 0.8,
      GradePercentTier11: 0.76,
      GradePercentTier12: 0.72,
      GradePercentTier13: 0.68,
      GradePercentTier14: 0.64,
      GradePercentTier15: 0.6,
      GradePercentTier16: 0.55,
      GradePercentTier17: -999,
    }
  }

  defaultStyle(mode) {
    if (mode === 'be-mu') return 'single5'
    if (mode === 'gddm') return 'real'
    if (mode === 'gdgm') return 'five'
    if (mode === 'gh') return 'solo'
    if (mode === 'kickbox') return 'human'
    if (mode === 'pomu') return 'three'
    if (mode === 'rockband') return 'easy'
    if (mode === 'drums') return 'normal'
    if (mode === 'techno') return 'single4'

    return 'single'
  }

  /**
   *
   * @param {number} score - Scale from 0.00000 to 1.00000
   * @returns {ScoreGrade}
   */
  scorePointsToGrade(score) {
    if (score >= this.grades.GradePercentTier01) {
      return '****'
    }

    if (score >= this.grades.GradePercentTier02) {
      return '***'
    }

    if (score >= this.grades.GradePercentTier03) {
      return '**'
    }

    if (score >= this.grades.GradePercentTier04) {
      return '*'
    }

    if (score >= this.grades.GradePercentTier05) {
      return 'S+'
    }

    if (score >= this.grades.GradePercentTier06) {
      return 'S'
    }

    if (score >= this.grades.GradePercentTier07) {
      return 'S-'
    }

    if (score >= this.grades.GradePercentTier08) {
      return 'A+'
    }

    if (score >= this.grades.GradePercentTier09) {
      return 'A'
    }

    if (score >= this.grades.GradePercentTier10) {
      return 'A-'
    }

    if (score >= this.grades.GradePercentTier11) {
      return 'B+'
    }

    if (score >= this.grades.GradePercentTier12) {
      return 'B'
    }

    if (score >= this.grades.GradePercentTier13) {
      return 'B-'
    }

    if (score >= this.grades.GradePercentTier14) {
      return 'C+'
    }

    if (score >= this.grades.GradePercentTier15) {
      return 'C'
    }

    if (score >= this.grades.GradePercentTier16) {
      return 'C-'
    }

    return 'D'
  }

  /**
   *
   * @param {ScoreGrade} grade
   */
  gradeToGradeEmoji(grade) {
    if (grade === '****') return '<:Tier01:1160231270199078912>'
    if (grade === '***') return '<:Tier02:1160231273848111114>'
    if (grade === '**') return '<:Tier03:1160231276054315178> '
    if (grade === '*') return '<:Tier04:1160231279598510192>'
    if (grade === 'S+') return '<:Tier05:1160231283465662484>'
    if (grade === 'S') return '<:Tier06:1160422172108521504>'
    if (grade === 'S-') return '<:Tier07:1160231289782288455>'
    if (grade === 'A+') return '<:Tier08:1160231292634415248>'
    if (grade === 'A') return '<:Tier09:1160422173597503590>'
    if (grade === 'A-') return '<:Tier10:1160231298468692018>'
    if (grade === 'B+') return '<:Tier11:1160231301740253316>'
    if (grade === 'B') return '<:Tier12:1160422176336396369>'
    if (grade === 'B-') return '<:Tier13:1160231304944697417>'
    if (grade === 'C+') return '<:Tier14:1160231308530827365>'
    if (grade === 'C') return '<:Tier15:1160422179557605386>'
    if (grade === 'C-') return '<:Tier16:1160231315690496100>'

    return '<:Tier17:1160422180950114334>'
  }
  /**
   *
   * @param {number} score
   */
  scorePointsToScoreString(score) {
    if (score === this.grades.GradePercentTier01) return '100.00%'

    let splitScore = score.toFixed(4).toString().substring(2, 6).split('')
    splitScore.splice(2, 0, '.')

    return splitScore.join('') + '%'
  }

  /**
   *
   * @param {AllScores_Score[]} scores
   */
  scoresToFormattedString(scores, sort = true) {
    let finalString = ''

    if (sort) {
      scores.sort((a, b) => {
        if (a === b) return 0

        return a.score > b.score
      })
    }

    for (let i = 0; i < scores.length; i++) {
      const score = scores[i]

      finalString += `${this.gradeToGradeEmoji(this.scorePointsToGrade(score.score))} \`${
        score.username
      }\` - ${this.scorePointsToScoreString(
        score.score
      )}\n`
    }

    return finalString
  }

  /**
   *
   * @param {string} songName
   * @param {AllScores_RequestOptions} [options]
   * @returns {import('./types.d.ts').SongScores}
   */
  async getScoresFromSong(songName, options = { limit: 10 }) {
    if (!songName) {
      return null
    }

    let song = null

    const volumes = Object.keys(this.chartKeys)

    for (let i = 0; i < volumes.length; i++) {
      const volume = this.chartKeys[volumes[i]]
      const songExists = Object.keys(volume).includes(songName)

      if (songExists) {
        song = this.chartKeys[volumes[i]][songName]
        i = volumes.length
        continue
      }
    }

    if (!song) return null

    const scores = {}
    let modesForSong = Object.keys(song)

    if (options.mode) {
      if (Array.isArray(options.mode)) {
        modesForSong = modesForSong.filter((mode) =>
          options.mode.includes(mode)
        )
      } else {
        modesForSong = modesForSong.filter((mode) => mode === options.mode)
      }
    }

    for (let i = 0; i < modesForSong.length; i++) {
      const mode = modesForSong[i]
      let difficulties = Object.keys(song[mode])

      // FILTER- Difficulty
      if (options.difficulty) {
        if (Array.isArray(options.difficulty)) {
          difficulties = difficulties.filter((difficulty) =>
            options.difficulty.includes(difficulty)
          )
        } else {
          difficulties = difficulties.filter(
            (difficulty) => difficulty === options.difficulty
          )
        }
      }

      for (let j = 0; j < difficulties.length; j++) {
        const difficulty = difficulties[j]
        let keys = []
        let styles = []
        let credits = []

        if (Array.isArray(song[mode][difficulty])) {
          const charts = song[mode][difficulty]

          for (let ch = 0; ch < charts.length; ch++) {
            const currentChart = charts[ch]

            keys.push(currentChart.key)
            credits.push(currentChart.by)
            styles.push(currentChart.style || this.defaultStyle(mode))
          }
        } else {
          styles.push(song[mode][difficulty].style || this.defaultStyle(mode))
          keys.push(song[mode][difficulty].key)
          credits.push(song[mode][difficulty].by)
        }

        // FILTER - Style
        if (options.style) {

        }

        for (let k = 0; k < keys.length; k++) {
          const key = keys[k]

          const response = await axios({
            method: 'POST',
            url: 'https://outfox.online:8443/api/v1/client/highscore/all',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              'user-agent': 'OutFox0.5',
            },
            data: {
              chartKey: key,
              scoreType: options?.scoreType || 'original',
            },
            port: 8443,
          })

          if (response?.status !== 200) {
            console.error(
              `Failed to get scores for ${songName} for score type ${
                options?.scoreType || 'original'
              }`
            )
            continue
          }

          /**
           * @type {AllScores_Score[] | null}
           */
          let responseScores = response.data.response?.scores

          if (!responseScores) {
            console.trace('Guess the data was mal-formatted.')
            continue
          }

          if (0 >= responseScores.length) continue

          if (responseScores.length > options.limit) {
            responseScores.splice(options.limit, responseScores.length - options.limit)
          }

          if (options.username) {
            responseScores.filter(
              (score) => score.username === options.username
            )
          }

          for (let s = 0; s < responseScores.length; s++) {
            const score = responseScores[s]
            score.credit = credits[k]
          }

          
          const style = styles[k]
          // TODO: Filter out unwated styles by options.style

          if (!scores[mode]) {
            scores[mode] = {}
          }

          if (!scores[mode][difficulty]) {
            scores[mode][difficulty] = {}
          }

          if (!scores[mode][difficulty][style]) {
            scores[mode][difficulty][style] = []
          }

          scores[mode][difficulty][style].push(...responseScores)
          // TODO: Filter by scoreType. Not feeling too hasteful about that.
          // TODO: Add caching (?)
        }
      }
    }

    return scores
  }
}

exports.Ofline = OFline

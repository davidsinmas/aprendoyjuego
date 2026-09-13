(()=>{
  const BASE='assets/audio/narration/';
  const SEGMENTS={
  "number:0": {
    "file": "numbers.mp3",
    "start": 0,
    "end": 0.305
  },
  "number:1": {
    "file": "numbers.mp3",
    "start": 0.275,
    "end": 0.545
  },
  "number:2": {
    "file": "numbers.mp3",
    "start": 0.715,
    "end": 1.585
  },
  "number:3": {
    "file": "numbers.mp3",
    "start": 1.591,
    "end": 2.065
  },
  "number:4": {
    "file": "numbers.mp3",
    "start": 2.055,
    "end": 2.625
  },
  "number:5": {
    "file": "numbers.mp3",
    "start": 2.642,
    "end": 3.265
  },
  "number:6": {
    "file": "numbers.mp3",
    "start": 3.303,
    "end": 3.905
  },
  "number:7": {
    "file": "numbers.mp3",
    "start": 3.975,
    "end": 4.625
  },
  "number:8": {
    "file": "numbers.mp3",
    "start": 4.735,
    "end": 5.425
  },
  "number:9": {
    "file": "numbers.mp3",
    "start": 5.395,
    "end": 6.065
  },
  "number:10": {
    "file": "numbers.mp3",
    "start": 6.035,
    "end": 6.465
  },
  "number:11": {
    "file": "numbers.mp3",
    "start": 6.551,
    "end": 7.345
  },
  "number:12": {
    "file": "numbers.mp3",
    "start": 7.415,
    "end": 8.145
  },
  "number:13": {
    "file": "numbers.mp3",
    "start": 8.115,
    "end": 8.705
  },
  "number:14": {
    "file": "numbers.mp3",
    "start": 8.735,
    "end": 9.585
  },
  "number:15": {
    "file": "numbers.mp3",
    "start": 9.548,
    "end": 10.145
  },
  "number:16": {
    "file": "numbers.mp3",
    "start": 10.155,
    "end": 11.265
  },
  "number:17": {
    "file": "numbers.mp3",
    "start": 11.275,
    "end": 12.225
  },
  "number:18": {
    "file": "numbers.mp3",
    "start": 12.295,
    "end": 13.425
  },
  "number:19": {
    "file": "numbers.mp3",
    "start": 13.455,
    "end": 14.625
  },
  "number:20": {
    "file": "numbers.mp3",
    "start": 14.642,
    "end": 15.265
  },
  "number:21": {
    "file": "numbers.mp3",
    "start": 15.335,
    "end": 16.465
  },
  "number:22": {
    "file": "numbers.mp3",
    "start": 16.535,
    "end": 17.745
  },
  "number:23": {
    "file": "numbers.mp3",
    "start": 17.762,
    "end": 18.865
  },
  "number:24": {
    "file": "numbers.mp3",
    "start": 18.935,
    "end": 20.065
  },
  "number:25": {
    "file": "numbers.mp3",
    "start": 20.108,
    "end": 21.265
  },
  "number:26": {
    "file": "numbers.mp3",
    "start": 21.308,
    "end": 22.545
  },
  "number:27": {
    "file": "numbers.mp3",
    "start": 22.588,
    "end": 23.665
  },
  "number:28": {
    "file": "numbers.mp3",
    "start": 23.735,
    "end": 25.025
  },
  "number:29": {
    "file": "numbers.mp3",
    "start": 25.042,
    "end": 25.985
  },
  "number:30": {
    "file": "numbers.mp3",
    "start": 26.075,
    "end": 27.025
  },
  "number:31": {
    "file": "numbers.mp3",
    "start": 27.075,
    "end": 28.305
  },
  "number:32": {
    "file": "numbers.mp3",
    "start": 28.335,
    "end": 29.505
  },
  "number:33": {
    "file": "numbers.mp3",
    "start": 29.555,
    "end": 30.945
  },
  "number:34": {
    "file": "numbers.mp3",
    "start": 30.955,
    "end": 32.225
  },
  "number:35": {
    "file": "numbers.mp3",
    "start": 32.255,
    "end": 33.585
  },
  "number:36": {
    "file": "numbers.mp3",
    "start": 33.615,
    "end": 34.865
  },
  "number:37": {
    "file": "numbers.mp3",
    "start": 34.935,
    "end": 36.385
  },
  "number:38": {
    "file": "numbers.mp3",
    "start": 36.395,
    "end": 37.585
  },
  "number:39": {
    "file": "numbers.mp3",
    "start": 37.615,
    "end": 38.865
  },
  "number:40": {
    "file": "numbers.mp3",
    "start": 38.908,
    "end": 39.825
  },
  "number:41": {
    "file": "numbers.mp3",
    "start": 39.895,
    "end": 41.265
  },
  "number:42": {
    "file": "numbers.mp3",
    "start": 41.308,
    "end": 42.545
  },
  "number:43": {
    "file": "numbers.mp3",
    "start": 42.642,
    "end": 44.065
  },
  "number:44": {
    "file": "numbers.mp3",
    "start": 44.108,
    "end": 45.425
  },
  "number:45": {
    "file": "numbers.mp3",
    "start": 45.468,
    "end": 46.785
  },
  "number:46": {
    "file": "numbers.mp3",
    "start": 46.828,
    "end": 48.145
  },
  "number:47": {
    "file": "numbers.mp3",
    "start": 48.215,
    "end": 49.665
  },
  "number:48": {
    "file": "numbers.mp3",
    "start": 49.682,
    "end": 50.865
  },
  "number:49": {
    "file": "numbers.mp3",
    "start": 50.935,
    "end": 52.225
  },
  "number:50": {
    "file": "numbers.mp3",
    "start": 52.375,
    "end": 53.425
  },
  "number:51": {
    "file": "numbers.mp3",
    "start": 53.535,
    "end": 54.705
  },
  "number:52": {
    "file": "numbers.mp3",
    "start": 54.855,
    "end": 56.145
  },
  "number:53": {
    "file": "numbers.mp3",
    "start": 56.295,
    "end": 57.825
  },
  "number:54": {
    "file": "numbers.mp3",
    "start": 57.895,
    "end": 59.185
  },
  "number:55": {
    "file": "numbers.mp3",
    "start": 59.335,
    "end": 60.865
  },
  "number:56": {
    "file": "numbers.mp3",
    "start": 60.935,
    "end": 62.305
  },
  "number:57": {
    "file": "numbers.mp3",
    "start": 62.455,
    "end": 63.985
  },
  "number:58": {
    "file": "numbers.mp3",
    "start": 64.055,
    "end": 65.345
  },
  "number:59": {
    "file": "numbers.mp3",
    "start": 65.455,
    "end": 66.785
  },
  "number:60": {
    "file": "numbers.mp3",
    "start": 66.835,
    "end": 67.825
  },
  "number:61": {
    "file": "numbers.mp3",
    "start": 67.915,
    "end": 69.345
  },
  "number:62": {
    "file": "numbers.mp3",
    "start": 69.395,
    "end": 70.705
  },
  "number:63": {
    "file": "numbers.mp3",
    "start": 70.775,
    "end": 72.305
  },
  "number:64": {
    "file": "numbers.mp3",
    "start": 72.355,
    "end": 73.665
  },
  "number:65": {
    "file": "numbers.mp3",
    "start": 73.775,
    "end": 75.425
  },
  "number:66": {
    "file": "numbers.mp3",
    "start": 75.495,
    "end": 76.945
  },
  "number:67": {
    "file": "numbers.mp3",
    "start": 77.035,
    "end": 78.625
  },
  "number:68": {
    "file": "numbers.mp3",
    "start": 78.695,
    "end": 80.145
  },
  "number:69": {
    "file": "numbers.mp3",
    "start": 80.195,
    "end": 81.585
  },
  "number:70": {
    "file": "numbers.mp3",
    "start": 81.655,
    "end": 82.625
  },
  "number:71": {
    "file": "numbers.mp3",
    "start": 82.715,
    "end": 84.145
  },
  "number:72": {
    "file": "numbers.mp3",
    "start": 84.195,
    "end": 85.505
  },
  "number:73": {
    "file": "numbers.mp3",
    "start": 85.575,
    "end": 87.105
  },
  "number:74": {
    "file": "numbers.mp3",
    "start": 87.155,
    "end": 88.545
  },
  "number:75": {
    "file": "numbers.mp3",
    "start": 88.595,
    "end": 90.145
  },
  "number:76": {
    "file": "numbers.mp3",
    "start": 90.175,
    "end": 91.585
  },
  "number:77": {
    "file": "numbers.mp3",
    "start": 91.655,
    "end": 93.105
  },
  "number:78": {
    "file": "numbers.mp3",
    "start": 93.175,
    "end": 94.625
  },
  "number:79": {
    "file": "numbers.mp3",
    "start": 94.695,
    "end": 96.225
  },
  "number:80": {
    "file": "numbers.mp3",
    "start": 96.295,
    "end": 97.185
  },
  "number:81": {
    "file": "numbers.mp3",
    "start": 97.295,
    "end": 98.705
  },
  "number:82": {
    "file": "numbers.mp3",
    "start": 98.795,
    "end": 100.145
  },
  "number:83": {
    "file": "numbers.mp3",
    "start": 100.235,
    "end": 101.745
  },
  "number:84": {
    "file": "numbers.mp3",
    "start": 101.795,
    "end": 103.185
  },
  "number:85": {
    "file": "numbers.mp3",
    "start": 103.255,
    "end": 104.785
  },
  "number:86": {
    "file": "numbers.mp3",
    "start": 104.815,
    "end": 106.145
  },
  "number:87": {
    "file": "numbers.mp3",
    "start": 106.235,
    "end": 107.825
  },
  "number:88": {
    "file": "numbers.mp3",
    "start": 107.875,
    "end": 109.185
  },
  "number:89": {
    "file": "numbers.mp3",
    "start": 109.255,
    "end": 110.705
  },
  "number:90": {
    "file": "numbers.mp3",
    "start": 110.802,
    "end": 111.745
  },
  "number:91": {
    "file": "numbers.mp3",
    "start": 111.868,
    "end": 113.265
  },
  "number:92": {
    "file": "numbers.mp3",
    "start": 113.335,
    "end": 114.545
  },
  "number:93": {
    "file": "numbers.mp3",
    "start": 114.642,
    "end": 116.145
  },
  "number:94": {
    "file": "numbers.mp3",
    "start": 116.188,
    "end": 117.585
  },
  "number:95": {
    "file": "numbers.mp3",
    "start": 117.628,
    "end": 119.105
  },
  "number:96": {
    "file": "numbers.mp3",
    "start": 119.122,
    "end": 120.385
  },
  "number:97": {
    "file": "numbers.mp3",
    "start": 120.482,
    "end": 121.985
  },
  "number:98": {
    "file": "numbers.mp3",
    "start": 122.055,
    "end": 123.425
  },
  "number:99": {
    "file": "numbers.mp3",
    "start": 123.495,
    "end": 124.865
  },
  "number:100": {
    "file": "numbers.mp3",
    "start": 124.975,
    "end": 125.585
  },
  "number:101": {
    "file": "numbers.mp3",
    "start": 125.775,
    "end": 126.865
  },
  "number:102": {
    "file": "numbers.mp3",
    "start": 127.055,
    "end": 128.305
  },
  "number:103": {
    "file": "numbers.mp3",
    "start": 128.415,
    "end": 129.505
  },
  "number:104": {
    "file": "numbers.mp3",
    "start": 129.695,
    "end": 130.945
  },
  "number:105": {
    "file": "numbers.mp3",
    "start": 130.855,
    "end": 131.681
  },
  "number:106": {
    "file": "numbers.mp3",
    "start": 131.655,
    "end": 133.473
  },
  "number:107": {
    "file": "numbers.mp3",
    "start": 133.527,
    "end": 134.965
  },
  "number:108": {
    "file": "numbers.mp3",
    "start": 134.975,
    "end": 136.465
  },
  "number:109": {
    "file": "numbers.mp3",
    "start": 136.482,
    "end": 137.685
  },
  "number:110": {
    "file": "numbers.mp3",
    "start": 137.655,
    "end": 139.105
  },
  "number:111": {
    "file": "numbers.mp3",
    "start": 139.095,
    "end": 140.737
  },
  "number:112": {
    "file": "numbers.mp3",
    "start": 140.743,
    "end": 142.172
  },
  "number:113": {
    "file": "numbers.mp3",
    "start": 142.135,
    "end": 143.605
  },
  "number:114": {
    "file": "numbers.mp3",
    "start": 143.575,
    "end": 145.345
  },
  "number:115": {
    "file": "numbers.mp3",
    "start": 145.335,
    "end": 146.745
  },
  "number:116": {
    "file": "numbers.mp3",
    "start": 146.775,
    "end": 148.572
  },
  "number:117": {
    "file": "numbers.mp3",
    "start": 148.535,
    "end": 150.405
  },
  "number:118": {
    "file": "numbers.mp3",
    "start": 150.415,
    "end": 152.225
  },
  "number:119": {
    "file": "numbers.mp3",
    "start": 152.242,
    "end": 153.845
  },
  "number:120": {
    "file": "numbers.mp3",
    "start": 153.815,
    "end": 155.385
  },
  "number:121": {
    "file": "numbers.mp3",
    "start": 155.415,
    "end": 157.105
  },
  "number:122": {
    "file": "numbers.mp3",
    "start": 157.148,
    "end": 158.705
  },
  "number:123": {
    "file": "numbers.mp3",
    "start": 158.695,
    "end": 160.518
  },
  "number:124": {
    "file": "numbers.mp3",
    "start": 160.535,
    "end": 162.605
  },
  "number:125": {
    "file": "numbers.mp3",
    "start": 162.575,
    "end": 164.185
  },
  "number:126": {
    "file": "numbers.mp3",
    "start": 164.135,
    "end": 165.985
  },
  "number:127": {
    "file": "numbers.mp3",
    "start": 165.975,
    "end": 167.825
  },
  "number:128": {
    "file": "numbers.mp3",
    "start": 167.815,
    "end": 169.665
  },
  "number:129": {
    "file": "numbers.mp3",
    "start": 169.682,
    "end": 171.205
  },
  "number:130": {
    "file": "numbers.mp3",
    "start": 171.175,
    "end": 172.825
  },
  "number:131": {
    "file": "numbers.mp3",
    "start": 172.855,
    "end": 174.605
  },
  "number:132": {
    "file": "numbers.mp3",
    "start": 174.575,
    "end": 176.325
  },
  "number:133": {
    "file": "numbers.mp3",
    "start": 176.335,
    "end": 178.257
  },
  "number:134": {
    "file": "numbers.mp3",
    "start": 178.263,
    "end": 180.259
  },
  "number:135": {
    "file": "numbers.mp3",
    "start": 180.238,
    "end": 182.065
  },
  "number:136": {
    "file": "numbers.mp3",
    "start": 182.028,
    "end": 184.097
  },
  "number:137": {
    "file": "numbers.mp3",
    "start": 184.103,
    "end": 185.925
  },
  "number:138": {
    "file": "numbers.mp3",
    "start": 185.935,
    "end": 187.905
  },
  "number:139": {
    "file": "numbers.mp3",
    "start": 187.922,
    "end": 189.625
  },
  "number:140": {
    "file": "numbers.mp3",
    "start": 189.575,
    "end": 191.265
  },
  "number:141": {
    "file": "numbers.mp3",
    "start": 191.255,
    "end": 193.085
  },
  "number:142": {
    "file": "numbers.mp3",
    "start": 193.055,
    "end": 194.985
  },
  "number:143": {
    "file": "numbers.mp3",
    "start": 195.015,
    "end": 196.785
  },
  "number:144": {
    "file": "numbers.mp3",
    "start": 196.775,
    "end": 198.337
  },
  "number:145": {
    "file": "numbers.mp3",
    "start": 198.295,
    "end": 200.545
  },
  "number:146": {
    "file": "numbers.mp3",
    "start": 200.522,
    "end": 202.545
  },
  "number:147": {
    "file": "numbers.mp3",
    "start": 202.535,
    "end": 204.705
  },
  "number:148": {
    "file": "numbers.mp3",
    "start": 204.735,
    "end": 206.665
  },
  "number:149": {
    "file": "numbers.mp3",
    "start": 206.615,
    "end": 208.625
  },
  "number:150": {
    "file": "numbers.mp3",
    "start": 208.595,
    "end": 210.332
  },
  "number:151": {
    "file": "numbers.mp3",
    "start": 210.295,
    "end": 212.225
  },
  "number:152": {
    "file": "numbers.mp3",
    "start": 212.215,
    "end": 213.937
  },
  "number:153": {
    "file": "numbers.mp3",
    "start": 213.879,
    "end": 215.921
  },
  "number:154": {
    "file": "numbers.mp3",
    "start": 215.863,
    "end": 218.065
  },
  "number:155": {
    "file": "numbers.mp3",
    "start": 218.055,
    "end": 219.857
  },
  "number:156": {
    "file": "numbers.mp3",
    "start": 219.815,
    "end": 221.718
  },
  "number:157": {
    "file": "numbers.mp3",
    "start": 221.655,
    "end": 223.633
  },
  "number:158": {
    "file": "numbers.mp3",
    "start": 223.591,
    "end": 225.745
  },
  "number:159": {
    "file": "numbers.mp3",
    "start": 225.703,
    "end": 227.793
  },
  "number:160": {
    "file": "numbers.mp3",
    "start": 227.751,
    "end": 229.345
  },
  "number:161": {
    "file": "numbers.mp3",
    "start": 229.335,
    "end": 231.265
  },
  "number:162": {
    "file": "numbers.mp3",
    "start": 231.255,
    "end": 232.545
  },
  "number:163": {
    "file": "numbers.mp3",
    "start": 232.455,
    "end": 234.505
  },
  "number:164": {
    "file": "numbers.mp3",
    "start": 234.415,
    "end": 236.785
  },
  "number:165": {
    "file": "numbers.mp3",
    "start": 236.695,
    "end": 238.156
  },
  "number:166": {
    "file": "numbers.mp3",
    "start": 238.135,
    "end": 240.278
  },
  "number:167": {
    "file": "numbers.mp3",
    "start": 240.282,
    "end": 242.241
  },
  "number:168": {
    "file": "numbers.mp3",
    "start": 242.215,
    "end": 244.305
  },
  "number:169": {
    "file": "numbers.mp3",
    "start": 244.335,
    "end": 246.465
  },
  "number:170": {
    "file": "numbers.mp3",
    "start": 246.455,
    "end": 247.925
  },
  "number:171": {
    "file": "numbers.mp3",
    "start": 247.895,
    "end": 249.845
  },
  "number:172": {
    "file": "numbers.mp3",
    "start": 249.855,
    "end": 251.825
  },
  "number:173": {
    "file": "numbers.mp3",
    "start": 251.815,
    "end": 253.905
  },
  "number:174": {
    "file": "numbers.mp3",
    "start": 253.935,
    "end": 256.065
  },
  "number:175": {
    "file": "numbers.mp3",
    "start": 256.335,
    "end": 258.076
  },
  "number:176": {
    "file": "numbers.mp3",
    "start": 258.055,
    "end": 259.985
  },
  "number:177": {
    "file": "numbers.mp3",
    "start": 259.975,
    "end": 262.257
  },
  "number:178": {
    "file": "numbers.mp3",
    "start": 262.295,
    "end": 264.105
  },
  "number:179": {
    "file": "numbers.mp3",
    "start": 264.115,
    "end": 266.358
  },
  "number:180": {
    "file": "numbers.mp3",
    "start": 266.375,
    "end": 267.765
  },
  "number:181": {
    "file": "numbers.mp3",
    "start": 267.735,
    "end": 269.665
  },
  "number:182": {
    "file": "numbers.mp3",
    "start": 269.575,
    "end": 271.365
  },
  "number:183": {
    "file": "numbers.mp3",
    "start": 271.335,
    "end": 273.385
  },
  "number:184": {
    "file": "numbers.mp3",
    "start": 273.335,
    "end": 275.569
  },
  "number:185": {
    "file": "numbers.mp3",
    "start": 275.591,
    "end": 277.551
  },
  "number:186": {
    "file": "numbers.mp3",
    "start": 277.529,
    "end": 279.438
  },
  "number:187": {
    "file": "numbers.mp3",
    "start": 279.442,
    "end": 281.505
  },
  "number:188": {
    "file": "numbers.mp3",
    "start": 281.495,
    "end": 283.645
  },
  "number:189": {
    "file": "numbers.mp3",
    "start": 283.695,
    "end": 285.705
  },
  "number:190": {
    "file": "numbers.mp3",
    "start": 285.735,
    "end": 287.265
  },
  "number:191": {
    "file": "numbers.mp3",
    "start": 287.235,
    "end": 289.212
  },
  "number:192": {
    "file": "numbers.mp3",
    "start": 289.175,
    "end": 291.185
  },
  "number:193": {
    "file": "numbers.mp3",
    "start": 291.175,
    "end": 293.065
  },
  "number:194": {
    "file": "numbers.mp3",
    "start": 293.015,
    "end": 295.313
  },
  "number:195": {
    "file": "numbers.mp3",
    "start": 295.367,
    "end": 297.151
  },
  "number:196": {
    "file": "numbers.mp3",
    "start": 297.129,
    "end": 299.078
  },
  "number:197": {
    "file": "numbers.mp3",
    "start": 299.122,
    "end": 301.089
  },
  "number:198": {
    "file": "numbers.mp3",
    "start": 301.063,
    "end": 302.985
  },
  "number:199": {
    "file": "numbers.mp3",
    "start": 302.935,
    "end": 305.238
  },
  "number:200": {
    "file": "numbers.mp3",
    "start": 305.175,
    "end": 306.545
  },
  "word:ABEJA": {
    "file": "words.mp3",
    "start": 0,
    "end": 0.625
  },
  "word:ARBOL": {
    "file": "words.mp3",
    "start": 0.855,
    "end": 1.665
  },
  "word:AVE": {
    "file": "words.mp3",
    "start": 1.775,
    "end": 2.465
  },
  "word:AVION": {
    "file": "words.mp3",
    "start": 2.588,
    "end": 3.345
  },
  "word:BANANA": {
    "file": "words.mp3",
    "start": 3.392,
    "end": 4.305
  },
  "word:BARCO": {
    "file": "words.mp3",
    "start": 4.415,
    "end": 5.265
  },
  "word:BESO": {
    "file": "words.mp3",
    "start": 5.395,
    "end": 6.225
  },
  "word:BICI": {
    "file": "words.mp3",
    "start": 6.455,
    "end": 7.265
  },
  "word:BOTA": {
    "file": "words.mp3",
    "start": 7.415,
    "end": 8.145
  },
  "word:BUS": {
    "file": "words.mp3",
    "start": 8.295,
    "end": 9.105
  },
  "word:CABALLO": {
    "file": "words.mp3",
    "start": 9.155,
    "end": 9.985
  },
  "word:CAMA": {
    "file": "words.mp3",
    "start": 10.175,
    "end": 10.865
  },
  "word:CAMELLO": {
    "file": "words.mp3",
    "start": 10.955,
    "end": 11.985
  },
  "word:CAMION": {
    "file": "words.mp3",
    "start": 12.055,
    "end": 12.945
  },
  "word:CAMISA": {
    "file": "words.mp3",
    "start": 13.035,
    "end": 14.065
  },
  "word:CAMPANA": {
    "file": "words.mp3",
    "start": 14.155,
    "end": 15.185
  },
  "word:CANGURO": {
    "file": "words.mp3",
    "start": 15.335,
    "end": 16.305
  },
  "word:CARACOL": {
    "file": "words.mp3",
    "start": 16.355,
    "end": 17.345
  },
  "word:CASA": {
    "file": "words.mp3",
    "start": 17.447,
    "end": 18.305
  },
  "word:CERDO": {
    "file": "words.mp3",
    "start": 18.415,
    "end": 19.345
  },
  "word:COCHE": {
    "file": "words.mp3",
    "start": 19.468,
    "end": 20.305
  },
  "word:COL": {
    "file": "words.mp3",
    "start": 20.455,
    "end": 21.265
  },
  "word:CONEJO": {
    "file": "words.mp3",
    "start": 21.351,
    "end": 22.385
  },
  "word:CUNA": {
    "file": "words.mp3",
    "start": 22.575,
    "end": 23.345
  },
  "word:ESPEJO": {
    "file": "words.mp3",
    "start": 23.495,
    "end": 24.465
  },
  "word:ESTRELLA": {
    "file": "words.mp3",
    "start": 24.555,
    "end": 25.665
  },
  "word:FLAN": {
    "file": "words.mp3",
    "start": 25.815,
    "end": 26.705
  },
  "word:FLOR": {
    "file": "words.mp3",
    "start": 26.823,
    "end": 27.745
  },
  "word:FRESA": {
    "file": "words.mp3",
    "start": 27.895,
    "end": 28.785
  },
  "word:FUEGO": {
    "file": "words.mp3",
    "start": 28.915,
    "end": 29.825
  },
  "word:GALLINA": {
    "file": "words.mp3",
    "start": 29.879,
    "end": 30.945
  },
  "word:GATO": {
    "file": "words.mp3",
    "start": 31.135,
    "end": 31.905
  },
  "word:GIRASOL": {
    "file": "words.mp3",
    "start": 31.975,
    "end": 33.105
  },
  "word:HOJA": {
    "file": "words.mp3",
    "start": 33.282,
    "end": 34.145
  },
  "word:HUEVO": {
    "file": "words.mp3",
    "start": 34.335,
    "end": 35.185
  },
  "word:ISLA": {
    "file": "words.mp3",
    "start": 35.362,
    "end": 36.145
  },
  "word:KOALA": {
    "file": "words.mp3",
    "start": 36.295,
    "end": 37.265
  },
  "word:LANA": {
    "file": "words.mp3",
    "start": 37.535,
    "end": 38.305
  },
  "word:LAPIZ": {
    "file": "words.mp3",
    "start": 38.508,
    "end": 39.505
  },
  "word:LECHE": {
    "file": "words.mp3",
    "start": 39.682,
    "end": 40.625
  },
  "word:LEON": {
    "file": "words.mp3",
    "start": 40.775,
    "end": 41.905
  },
  "word:LIBRO": {
    "file": "words.mp3",
    "start": 41.948,
    "end": 42.705
  },
  "word:LLAVE": {
    "file": "words.mp3",
    "start": 42.882,
    "end": 43.825
  },
  "word:LUNA": {
    "file": "words.mp3",
    "start": 44.095,
    "end": 45.185
  },
  "word:MALETA": {
    "file": "words.mp3",
    "start": 45.228,
    "end": 46.065
  },
  "word:MANO": {
    "file": "words.mp3",
    "start": 46.167,
    "end": 47.025
  },
  "word:MANZANA": {
    "file": "words.mp3",
    "start": 47.115,
    "end": 48.465
  },
  "word:MAR": {
    "file": "words.mp3",
    "start": 48.555,
    "end": 49.185
  },
  "word:MONO": {
    "file": "words.mp3",
    "start": 49.319,
    "end": 50.305
  },
  "word:NARANJA": {
    "file": "words.mp3",
    "start": 50.495,
    "end": 51.505
  },
  "word:NIEVE": {
    "file": "words.mp3",
    "start": 51.595,
    "end": 52.465
  },
  "word:NUBE": {
    "file": "words.mp3",
    "start": 52.695,
    "end": 53.505
  },
  "word:OSO": {
    "file": "words.mp3",
    "start": 53.855,
    "end": 54.545
  },
  "word:OVEJA": {
    "file": "words.mp3",
    "start": 54.775,
    "end": 55.585
  },
  "word:PALOMA": {
    "file": "words.mp3",
    "start": 55.675,
    "end": 56.705
  },
  "word:PAN": {
    "file": "words.mp3",
    "start": 56.835,
    "end": 57.585
  },
  "word:PANDA": {
    "file": "words.mp3",
    "start": 57.668,
    "end": 58.625
  },
  "word:PATO": {
    "file": "words.mp3",
    "start": 58.715,
    "end": 59.505
  },
  "word:PELOTA": {
    "file": "words.mp3",
    "start": 59.595,
    "end": 60.625
  },
  "word:PERA": {
    "file": "words.mp3",
    "start": 60.735,
    "end": 61.585
  },
  "word:PERRO": {
    "file": "words.mp3",
    "start": 61.695,
    "end": 62.625
  },
  "word:PEZ": {
    "file": "words.mp3",
    "start": 62.748,
    "end": 63.505
  },
  "word:POLLO": {
    "file": "words.mp3",
    "start": 63.615,
    "end": 64.465
  },
  "word:PRINCESA": {
    "file": "words.mp3",
    "start": 64.515,
    "end": 65.745
  },
  "word:QUESO": {
    "file": "words.mp3",
    "start": 65.895,
    "end": 67.185
  },
  "word:RANA": {
    "file": "words.mp3",
    "start": 67.295,
    "end": 67.985
  },
  "word:RATON": {
    "file": "words.mp3",
    "start": 68.095,
    "end": 69.105
  },
  "word:RELOJ": {
    "file": "words.mp3",
    "start": 69.255,
    "end": 70.465
  },
  "word:ROJA": {
    "file": "words.mp3",
    "start": 70.588,
    "end": 71.345
  },
  "word:SEMILLA": {
    "file": "words.mp3",
    "start": 71.455,
    "end": 72.545
  },
  "word:SILLA": {
    "file": "words.mp3",
    "start": 72.775,
    "end": 73.985
  },
  "word:SOL": {
    "file": "words.mp3",
    "start": 74.095,
    "end": 74.785
  },
  "word:SOMBRERO": {
    "file": "words.mp3",
    "start": 74.895,
    "end": 75.985
  },
  "word:SONRISA": {
    "file": "words.mp3",
    "start": 76.095,
    "end": 77.585
  },
  "word:SOPA": {
    "file": "words.mp3",
    "start": 77.695,
    "end": 78.385
  },
  "word:TAZA": {
    "file": "words.mp3",
    "start": 78.575,
    "end": 79.345
  },
  "word:TIGRE": {
    "file": "words.mp3",
    "start": 79.535,
    "end": 80.385
  },
  "word:TOMATE": {
    "file": "words.mp3",
    "start": 80.475,
    "end": 81.505
  },
  "word:TORTUGA": {
    "file": "words.mp3",
    "start": 81.575,
    "end": 82.625
  },
  "word:TREN": {
    "file": "words.mp3",
    "start": 82.727,
    "end": 83.585
  },
  "word:UVA": {
    "file": "words.mp3",
    "start": 83.855,
    "end": 84.865
  },
  "word:VACA": {
    "file": "words.mp3",
    "start": 84.915,
    "end": 85.585
  },
  "word:VENTANA": {
    "file": "words.mp3",
    "start": 85.645,
    "end": 86.785
  },
  "word:ZAPATO": {
    "file": "words.mp3",
    "start": 86.895,
    "end": 87.985
  },
  "word:ZORRO": {
    "file": "words.mp3",
    "start": 88.215,
    "end": 89.265
  },
  "text:toca el numero mayor": {
    "file": "instructions.mp3",
    "start": 0,
    "end": 1.265
  },
  "text:toca el numero menor": {
    "file": "instructions.mp3",
    "start": 1.535,
    "end": 3.745
  },
  "text:completa la palabra": {
    "file": "instructions.mp3",
    "start": 3.792,
    "end": 5.585
  },
  "text:elige la silaba que falta": {
    "file": "instructions.mp3",
    "start": 5.788,
    "end": 8.065
  },
  "text:ordena las silabas para formar esta palabra": {
    "file": "instructions.mp3",
    "start": 8.135,
    "end": 11.585
  },
  "text:elige la palabra que corresponde al dibujo": {
    "file": "instructions.mp3",
    "start": 11.735,
    "end": 14.705
  },
  "text:completa la letra que falta": {
    "file": "instructions.mp3",
    "start": 14.741,
    "end": 17.025
  },
  "text:elige la palabra correcta": {
    "file": "instructions.mp3",
    "start": 17.255,
    "end": 19.665
  },
  "text:escucha la palabra": {
    "file": "instructions.mp3",
    "start": 19.815,
    "end": 21.505
  },
  "text:escucha las palabras toca la letra por la que empieza": {
    "file": "instructions.mp3",
    "start": 21.635,
    "end": 25.825
  },
  "text:escucha la palabra toca la letra por la que termina": {
    "file": "instructions.mp3",
    "start": 25.975,
    "end": 30.225
  },
  "text:construye esta palabra": {
    "file": "instructions.mp3",
    "start": 30.306,
    "end": 32.785
  },
  "text:busca una palabra que rime con": {
    "file": "instructions.mp3",
    "start": 32.915,
    "end": 35.345
  },
  "text:mas": {
    "file": "instructions.mp3",
    "start": 35.375,
    "end": 35.825
  },
  "text:menos": {
    "file": "instructions.mp3",
    "start": 35.855,
    "end": 36.625
  },
  "text:empezamos con unidades cada pieza suelta es una unidad vamos a contarlas despacio una dos tres cuatro cinco seis siete ocho y nueve todavia son unidades sueltas": {
    "file": "pedagogy.mp3",
    "start": 0,
    "end": 21.905
  },
  "text:tenemos nueve unidades ahora llega una pieza mas nueve mas una son diez acabamos de pasar del nueve al diez": {
    "file": "pedagogy.mp3",
    "start": 21.955,
    "end": 32.945
  },
  "text:como diez piezas sueltas son muchas las guardamos juntas en una caja dentro hay exactamente diez unidades a este grupo completo lo llamamos una decena una decena vale lo mismo que diez unidades": {
    "file": "pedagogy.mp3",
    "start": 33.015,
    "end": 49.425
  },
  "text:la caja de la decena ya esta completa ahora aparece una unidad nueva y se queda fuera tenemos una decena que vale diez y una unidad mas diez mas uno son once": {
    "file": "pedagogy.mp3",
    "start": 49.628,
    "end": 65.105
  },
  "text:seguimos despacio una decena y una unidad son once con otra unidad llegamos a doce despues trece y con cuatro unidades sueltas llegamos a catorce la decena sigue completa solo aumentan las unidades de fuera": {
    "file": "pedagogy.mp3",
    "start": 65.075,
    "end": 84.225
  },
  "text:ya podemos mirar el catorce de otra forma el uno nos recuerda que hay una decena completa el cuatro nos dice que hay cuatro unidades sueltas por eso catorce es igual a diez mas cuatro ahora si vamos a practicar": {
    "file": "pedagogy.mp3",
    "start": 84.402,
    "end": 103.225
  },
  "text:construye una decena vamos a descubrir poco a poco como diez unidades forman una decena y como nacen los numeros mayores de 10 ejemplo 14 es igual a 10 + 4": {
    "file": "pedagogy.mp3",
    "start": 103.209,
    "end": 119.425
  },
  "text:aterriza en el 10 antes de seguir restando busca cuanto hay que quitar para llegar exactamente a 10 desde 16 quitamos 6 y aterrizamos en 10 ejemplo 16 menos 6 es igual a 10": {
    "file": "pedagogy.mp3",
    "start": 119.775,
    "end": 140.145
  },
  "text:cruza el puente del 10 si hay que quitar mas divide la resta en dos saltos en 14 menos 6 primero quita 4 para llegar a 10 y despues quita los 2 que faltan ejemplo 14 menos 6 es igual a 14 menos 4 menos 2 es igual a 8": {
    "file": "pedagogy.mp3",
    "start": 140.295,
    "end": 169.505
  },
  "text:resuelve historias ahora usa el puente del 10 en pequenas aventuras imagina los objetos quita los que se marchan y comprueba cuantos quedan ejemplo 15 luciernagas menos 7 que se van es igual a 8": {
    "file": "pedagogy.mp3",
    "start": 169.715,
    "end": 190.145
  },
  "text:mision final demuestra lo aprendido con seis restas para superar la mision necesitas acertar al menos la mitad puedes repetirla cuando quieras ejemplo piensa llegar a 10 y continuar": {
    "file": "pedagogy.mp3",
    "start": 190.375,
    "end": 207.665
  },
  "text:el 17 tiene una decena cuantas unidades sueltas tiene": {
    "file": "pedagogy.mp3",
    "start": 207.842,
    "end": 212.945
  },
  "text:el 12 tiene una decena cuantas unidades sueltas tiene": {
    "file": "pedagogy.mp3",
    "start": 213.122,
    "end": 217.905
  },
  "text:el 14 tiene una decena cuantas unidades sueltas tiene": {
    "file": "pedagogy.mp3",
    "start": 218.055,
    "end": 223.025
  },
  "text:el 19 tiene una decena cuantas unidades sueltas tiene": {
    "file": "pedagogy.mp3",
    "start": 223.202,
    "end": 228.625
  },
  "text:cuanto debes quitar a 18 para llegar a 10": {
    "file": "pedagogy.mp3",
    "start": 228.735,
    "end": 231.905
  },
  "text:cuanto debes quitar a 15 para llegar a 10": {
    "file": "pedagogy.mp3",
    "start": 232.175,
    "end": 235.185
  },
  "text:cuanto debes quitar a 16 para llegar a 10": {
    "file": "pedagogy.mp3",
    "start": 235.415,
    "end": 238.625
  },
  "text:cuanto debes quitar a 13 para llegar a 10": {
    "file": "pedagogy.mp3",
    "start": 238.855,
    "end": 241.745
  },
  "text:catorce menos seis primero quita 4 y despues 2 cuanto queda": {
    "file": "pedagogy.mp3",
    "start": 242.175,
    "end": 249.665
  },
  "text:quince menos siete primero quita 5 y despues 2 cuanto queda": {
    "file": "pedagogy.mp3",
    "start": 249.948,
    "end": 257.585
  },
  "text:dieciseis menos nueve primero quita 6 y despues 3 cuanto queda": {
    "file": "pedagogy.mp3",
    "start": 257.795,
    "end": 265.905
  },
  "text:trece menos cinco primero quita 3 y despues 2 cuanto queda": {
    "file": "pedagogy.mp3",
    "start": 266.135,
    "end": 273.985
  },
  "text:habia 13 galletas compartes 5 cuantas quedan": {
    "file": "pedagogy.mp3",
    "start": 274.195,
    "end": 279.585
  },
  "text:habia 16 peces se esconden 7 cuantos puedes ver": {
    "file": "pedagogy.mp3",
    "start": 279.775,
    "end": 285.505
  },
  "text:habia 15 luciernagas se fueron 7 cuantas quedan": {
    "file": "pedagogy.mp3",
    "start": 285.715,
    "end": 291.425
  },
  "text:habia 18 cohetes despegan 9 cuantos quedan": {
    "file": "pedagogy.mp3",
    "start": 291.655,
    "end": 297.345
  },
  "text:cuanto es doce menos cinco": {
    "file": "pedagogy.mp3",
    "start": 297.775,
    "end": 300.065
  },
  "text:cuanto es catorce menos ocho": {
    "file": "pedagogy.mp3",
    "start": 300.375,
    "end": 302.625
  },
  "text:cuanto es dieciocho menos nueve": {
    "file": "pedagogy.mp3",
    "start": 302.975,
    "end": 305.585
  },
  "text:cuanto es dieciseis menos seis": {
    "file": "pedagogy.mp3",
    "start": 305.855,
    "end": 308.545
  },
  "text:cuanto es diecinueve menos siete": {
    "file": "pedagogy.mp3",
    "start": 308.815,
    "end": 311.505
  },
  "text:cuanto es diecisiete menos nueve": {
    "file": "pedagogy.mp3",
    "start": 311.815,
    "end": 314.545
  }
};
  const FILES=[...new Set(Object.values(SEGMENTS).map(segment=>segment.file))];
  const players=new Map();
  let sequence=0;

  function normalize(text){
    return String(text==null?'':text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[¿?¡!.,:;]/g,'').replace(/\s+/g,' ').trim();
  }

  function player(file){
    if(players.has(file))return players.get(file);
    const audio=new Audio(BASE+file+'?v='+encodeURIComponent(window.APP_VERSION||'actual'));
    audio.preload='metadata';
    players.set(file,audio);
    return audio;
  }

  function stop(){
    sequence++;
    for(const audio of players.values())audio.pause();
  }

  function wait(milliseconds){
    return new Promise(resolve=>setTimeout(resolve,milliseconds));
  }

  async function playSegment(segment,run){
    const audio=player(segment.file);
    try{
      audio.pause();
      audio.currentTime=segment.start;
      await audio.play();
    }catch(error){
      return false;
    }
    await wait(Math.max(100,(segment.end-segment.start)*1000));
    if(run!==sequence)return false;
    audio.pause();
    return true;
  }

  async function playKeys(keys){
    stop();
    const run=sequence;
    for(let index=0;index<keys.length;index++){
      if(run!==sequence)return false;
      const segment=SEGMENTS[keys[index]];
      if(!segment||!await playSegment(segment,run))return false;
      if(index<keys.length-1)await wait(45);
    }
    return run===sequence;
  }

  function textKey(text){return 'text:'+normalize(text);}

  function playText(text){
    const raw=String(text==null?'':text).trim();
    const operation=raw.match(/^(\d+)\s+(más|menos)\s+(\d+)$/i);
    if(operation)return playKeys(['number:'+operation[1],textKey(operation[2]),'number:'+operation[3]]);
    const direct=textKey(raw);
    if(SEGMENTS[direct])return playKeys([direct]);
    const word='word:'+normalize(raw).toUpperCase();
    return SEGMENTS[word]?playKeys([word]):Promise.resolve(false);
  }

  function playWord(word,prefix=''){
    const keys=[];
    if(prefix){
      const instruction=textKey(prefix);
      if(SEGMENTS[instruction])keys.push(instruction);
    }
    const wordKey='word:'+normalize(word).toUpperCase();
    if(SEGMENTS[wordKey])keys.push(wordKey);
    else{
      const direct=textKey(word);
      if(SEGMENTS[direct])keys.push(direct);
    }
    return keys.length?playKeys(keys):Promise.resolve(false);
  }

  for(const file of FILES)player(file);
  window.Narration={playText,playWord,stop,hasText:text=>Boolean(SEGMENTS[textKey(text)]),segments:SEGMENTS};
})();


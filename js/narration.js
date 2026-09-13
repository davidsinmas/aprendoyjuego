(()=>{
  const BASE='assets/audio/narration/';
  const SEGMENTS={
  "number:0": {
    "file": "numbers-01.mp3",
    "start": 0,
    "end": 0.305
  },
  "number:1": {
    "file": "numbers-01.mp3",
    "start": 0.275,
    "end": 0.545
  },
  "number:2": {
    "file": "numbers-01.mp3",
    "start": 0.715,
    "end": 1.585
  },
  "number:3": {
    "file": "numbers-01.mp3",
    "start": 1.591,
    "end": 2.065
  },
  "number:4": {
    "file": "numbers-01.mp3",
    "start": 2.055,
    "end": 2.625
  },
  "number:5": {
    "file": "numbers-01.mp3",
    "start": 2.642,
    "end": 3.265
  },
  "number:6": {
    "file": "numbers-01.mp3",
    "start": 3.303,
    "end": 3.905
  },
  "number:7": {
    "file": "numbers-01.mp3",
    "start": 3.975,
    "end": 4.625
  },
  "number:8": {
    "file": "numbers-01.mp3",
    "start": 4.735,
    "end": 5.425
  },
  "number:9": {
    "file": "numbers-01.mp3",
    "start": 5.395,
    "end": 6.065
  },
  "number:10": {
    "file": "numbers-01.mp3",
    "start": 6.035,
    "end": 6.465
  },
  "number:11": {
    "file": "numbers-01.mp3",
    "start": 6.551,
    "end": 7.345
  },
  "number:12": {
    "file": "numbers-01.mp3",
    "start": 7.415,
    "end": 8.145
  },
  "number:13": {
    "file": "numbers-01.mp3",
    "start": 8.115,
    "end": 8.705
  },
  "number:14": {
    "file": "numbers-01.mp3",
    "start": 8.735,
    "end": 9.585
  },
  "number:15": {
    "file": "numbers-01.mp3",
    "start": 9.548,
    "end": 10.145
  },
  "number:16": {
    "file": "numbers-01.mp3",
    "start": 10.155,
    "end": 11.265
  },
  "number:17": {
    "file": "numbers-01.mp3",
    "start": 11.275,
    "end": 12.225
  },
  "number:18": {
    "file": "numbers-01.mp3",
    "start": 12.295,
    "end": 13.425
  },
  "number:19": {
    "file": "numbers-01.mp3",
    "start": 13.455,
    "end": 14.625
  },
  "number:20": {
    "file": "numbers-01.mp3",
    "start": 14.642,
    "end": 15.265
  },
  "number:21": {
    "file": "numbers-01.mp3",
    "start": 15.335,
    "end": 16.465
  },
  "number:22": {
    "file": "numbers-01.mp3",
    "start": 16.535,
    "end": 17.745
  },
  "number:23": {
    "file": "numbers-01.mp3",
    "start": 17.762,
    "end": 18.865
  },
  "number:24": {
    "file": "numbers-01.mp3",
    "start": 18.935,
    "end": 20.065
  },
  "number:25": {
    "file": "numbers-01.mp3",
    "start": 20.108,
    "end": 21.265
  },
  "number:26": {
    "file": "numbers-01.mp3",
    "start": 21.308,
    "end": 22.545
  },
  "number:27": {
    "file": "numbers-01.mp3",
    "start": 22.588,
    "end": 23.665
  },
  "number:28": {
    "file": "numbers-01.mp3",
    "start": 23.735,
    "end": 25.025
  },
  "number:29": {
    "file": "numbers-01.mp3",
    "start": 25.042,
    "end": 25.985
  },
  "number:30": {
    "file": "numbers-01.mp3",
    "start": 26.075,
    "end": 27.025
  },
  "number:31": {
    "file": "numbers-01.mp3",
    "start": 27.075,
    "end": 28.305
  },
  "number:32": {
    "file": "numbers-01.mp3",
    "start": 28.335,
    "end": 29.505
  },
  "number:33": {
    "file": "numbers-01.mp3",
    "start": 29.555,
    "end": 30.945
  },
  "number:34": {
    "file": "numbers-01.mp3",
    "start": 30.955,
    "end": 32.225
  },
  "number:35": {
    "file": "numbers-01.mp3",
    "start": 32.255,
    "end": 33.585
  },
  "number:36": {
    "file": "numbers-01.mp3",
    "start": 33.615,
    "end": 34.865
  },
  "number:37": {
    "file": "numbers-01.mp3",
    "start": 34.935,
    "end": 36.385
  },
  "number:38": {
    "file": "numbers-01.mp3",
    "start": 36.395,
    "end": 37.585
  },
  "number:39": {
    "file": "numbers-02.mp3",
    "start": 0,
    "end": 1.25
  },
  "number:40": {
    "file": "numbers-02.mp3",
    "start": 1.293,
    "end": 2.21
  },
  "number:41": {
    "file": "numbers-02.mp3",
    "start": 2.28,
    "end": 3.65
  },
  "number:42": {
    "file": "numbers-02.mp3",
    "start": 3.693,
    "end": 4.93
  },
  "number:43": {
    "file": "numbers-02.mp3",
    "start": 5.027,
    "end": 6.45
  },
  "number:44": {
    "file": "numbers-02.mp3",
    "start": 6.493,
    "end": 7.81
  },
  "number:45": {
    "file": "numbers-02.mp3",
    "start": 7.853,
    "end": 9.17
  },
  "number:46": {
    "file": "numbers-02.mp3",
    "start": 9.213,
    "end": 10.53
  },
  "number:47": {
    "file": "numbers-02.mp3",
    "start": 10.6,
    "end": 12.05
  },
  "number:48": {
    "file": "numbers-02.mp3",
    "start": 12.067,
    "end": 13.25
  },
  "number:49": {
    "file": "numbers-02.mp3",
    "start": 13.32,
    "end": 14.61
  },
  "number:50": {
    "file": "numbers-02.mp3",
    "start": 14.76,
    "end": 15.81
  },
  "number:51": {
    "file": "numbers-02.mp3",
    "start": 15.92,
    "end": 17.09
  },
  "number:52": {
    "file": "numbers-02.mp3",
    "start": 17.24,
    "end": 18.53
  },
  "number:53": {
    "file": "numbers-02.mp3",
    "start": 18.68,
    "end": 20.21
  },
  "number:54": {
    "file": "numbers-02.mp3",
    "start": 20.28,
    "end": 21.57
  },
  "number:55": {
    "file": "numbers-02.mp3",
    "start": 21.72,
    "end": 23.25
  },
  "number:56": {
    "file": "numbers-02.mp3",
    "start": 23.32,
    "end": 24.69
  },
  "number:57": {
    "file": "numbers-02.mp3",
    "start": 24.84,
    "end": 26.37
  },
  "number:58": {
    "file": "numbers-02.mp3",
    "start": 26.44,
    "end": 27.73
  },
  "number:59": {
    "file": "numbers-02.mp3",
    "start": 27.84,
    "end": 29.17
  },
  "number:60": {
    "file": "numbers-02.mp3",
    "start": 29.22,
    "end": 30.21
  },
  "number:61": {
    "file": "numbers-02.mp3",
    "start": 30.3,
    "end": 31.73
  },
  "number:62": {
    "file": "numbers-02.mp3",
    "start": 31.78,
    "end": 33.09
  },
  "number:63": {
    "file": "numbers-02.mp3",
    "start": 33.16,
    "end": 34.69
  },
  "number:64": {
    "file": "numbers-02.mp3",
    "start": 34.74,
    "end": 36.05
  },
  "number:65": {
    "file": "numbers-02.mp3",
    "start": 36.16,
    "end": 37.81
  },
  "number:66": {
    "file": "numbers-03.mp3",
    "start": 0,
    "end": 1.45
  },
  "number:67": {
    "file": "numbers-03.mp3",
    "start": 1.54,
    "end": 3.13
  },
  "number:68": {
    "file": "numbers-03.mp3",
    "start": 3.2,
    "end": 4.65
  },
  "number:69": {
    "file": "numbers-03.mp3",
    "start": 4.7,
    "end": 6.09
  },
  "number:70": {
    "file": "numbers-03.mp3",
    "start": 6.16,
    "end": 7.13
  },
  "number:71": {
    "file": "numbers-03.mp3",
    "start": 7.22,
    "end": 8.65
  },
  "number:72": {
    "file": "numbers-03.mp3",
    "start": 8.7,
    "end": 10.01
  },
  "number:73": {
    "file": "numbers-03.mp3",
    "start": 10.08,
    "end": 11.61
  },
  "number:74": {
    "file": "numbers-03.mp3",
    "start": 11.66,
    "end": 13.05
  },
  "number:75": {
    "file": "numbers-03.mp3",
    "start": 13.1,
    "end": 14.65
  },
  "number:76": {
    "file": "numbers-03.mp3",
    "start": 14.68,
    "end": 16.09
  },
  "number:77": {
    "file": "numbers-03.mp3",
    "start": 16.16,
    "end": 17.61
  },
  "number:78": {
    "file": "numbers-03.mp3",
    "start": 17.68,
    "end": 19.13
  },
  "number:79": {
    "file": "numbers-03.mp3",
    "start": 19.2,
    "end": 20.73
  },
  "number:80": {
    "file": "numbers-03.mp3",
    "start": 20.8,
    "end": 21.69
  },
  "number:81": {
    "file": "numbers-03.mp3",
    "start": 21.8,
    "end": 23.21
  },
  "number:82": {
    "file": "numbers-03.mp3",
    "start": 23.3,
    "end": 24.65
  },
  "number:83": {
    "file": "numbers-03.mp3",
    "start": 24.74,
    "end": 26.25
  },
  "number:84": {
    "file": "numbers-03.mp3",
    "start": 26.3,
    "end": 27.69
  },
  "number:85": {
    "file": "numbers-03.mp3",
    "start": 27.76,
    "end": 29.29
  },
  "number:86": {
    "file": "numbers-03.mp3",
    "start": 29.32,
    "end": 30.65
  },
  "number:87": {
    "file": "numbers-03.mp3",
    "start": 30.74,
    "end": 32.33
  },
  "number:88": {
    "file": "numbers-03.mp3",
    "start": 32.38,
    "end": 33.69
  },
  "number:89": {
    "file": "numbers-03.mp3",
    "start": 33.76,
    "end": 35.21
  },
  "number:90": {
    "file": "numbers-03.mp3",
    "start": 35.307,
    "end": 36.25
  },
  "number:91": {
    "file": "numbers-03.mp3",
    "start": 36.373,
    "end": 37.77
  },
  "number:92": {
    "file": "numbers-04.mp3",
    "start": 0,
    "end": 1.21
  },
  "number:93": {
    "file": "numbers-04.mp3",
    "start": 1.307,
    "end": 2.81
  },
  "number:94": {
    "file": "numbers-04.mp3",
    "start": 2.853,
    "end": 4.25
  },
  "number:95": {
    "file": "numbers-04.mp3",
    "start": 4.293,
    "end": 5.77
  },
  "number:96": {
    "file": "numbers-04.mp3",
    "start": 5.787,
    "end": 7.05
  },
  "number:97": {
    "file": "numbers-04.mp3",
    "start": 7.147,
    "end": 8.65
  },
  "number:98": {
    "file": "numbers-04.mp3",
    "start": 8.72,
    "end": 10.09
  },
  "number:99": {
    "file": "numbers-04.mp3",
    "start": 10.16,
    "end": 11.53
  },
  "number:100": {
    "file": "numbers-04.mp3",
    "start": 11.64,
    "end": 12.25
  },
  "number:101": {
    "file": "numbers-04.mp3",
    "start": 12.44,
    "end": 13.53
  },
  "number:102": {
    "file": "numbers-04.mp3",
    "start": 13.72,
    "end": 14.97
  },
  "number:103": {
    "file": "numbers-04.mp3",
    "start": 15.08,
    "end": 16.17
  },
  "number:104": {
    "file": "numbers-04.mp3",
    "start": 16.36,
    "end": 17.61
  },
  "number:105": {
    "file": "numbers-04.mp3",
    "start": 17.52,
    "end": 18.346
  },
  "number:106": {
    "file": "numbers-04.mp3",
    "start": 18.32,
    "end": 20.138
  },
  "number:107": {
    "file": "numbers-04.mp3",
    "start": 20.192,
    "end": 21.63
  },
  "number:108": {
    "file": "numbers-04.mp3",
    "start": 21.64,
    "end": 23.13
  },
  "number:109": {
    "file": "numbers-04.mp3",
    "start": 23.147,
    "end": 24.35
  },
  "number:110": {
    "file": "numbers-04.mp3",
    "start": 24.32,
    "end": 25.77
  },
  "number:111": {
    "file": "numbers-04.mp3",
    "start": 25.76,
    "end": 27.402
  },
  "number:112": {
    "file": "numbers-04.mp3",
    "start": 27.408,
    "end": 28.837
  },
  "number:113": {
    "file": "numbers-04.mp3",
    "start": 28.8,
    "end": 30.27
  },
  "number:114": {
    "file": "numbers-04.mp3",
    "start": 30.24,
    "end": 32.01
  },
  "number:115": {
    "file": "numbers-04.mp3",
    "start": 32,
    "end": 33.41
  },
  "number:116": {
    "file": "numbers-04.mp3",
    "start": 33.44,
    "end": 35.237
  },
  "number:117": {
    "file": "numbers-04.mp3",
    "start": 35.2,
    "end": 37.07
  },
  "number:118": {
    "file": "numbers-05.mp3",
    "start": 0,
    "end": 1.81
  },
  "number:119": {
    "file": "numbers-05.mp3",
    "start": 1.827,
    "end": 3.43
  },
  "number:120": {
    "file": "numbers-05.mp3",
    "start": 3.4,
    "end": 4.97
  },
  "number:121": {
    "file": "numbers-05.mp3",
    "start": 5,
    "end": 6.69
  },
  "number:122": {
    "file": "numbers-05.mp3",
    "start": 6.733,
    "end": 8.29
  },
  "number:123": {
    "file": "numbers-05.mp3",
    "start": 8.28,
    "end": 10.103
  },
  "number:124": {
    "file": "numbers-05.mp3",
    "start": 10.12,
    "end": 12.19
  },
  "number:125": {
    "file": "numbers-05.mp3",
    "start": 12.16,
    "end": 13.77
  },
  "number:126": {
    "file": "numbers-05.mp3",
    "start": 13.72,
    "end": 15.57
  },
  "number:127": {
    "file": "numbers-05.mp3",
    "start": 15.56,
    "end": 17.41
  },
  "number:128": {
    "file": "numbers-05.mp3",
    "start": 17.4,
    "end": 19.25
  },
  "number:129": {
    "file": "numbers-05.mp3",
    "start": 19.267,
    "end": 20.79
  },
  "number:130": {
    "file": "numbers-05.mp3",
    "start": 20.76,
    "end": 22.41
  },
  "number:131": {
    "file": "numbers-05.mp3",
    "start": 22.44,
    "end": 24.19
  },
  "number:132": {
    "file": "numbers-05.mp3",
    "start": 24.16,
    "end": 25.91
  },
  "number:133": {
    "file": "numbers-05.mp3",
    "start": 25.92,
    "end": 27.842
  },
  "number:134": {
    "file": "numbers-05.mp3",
    "start": 27.848,
    "end": 29.844
  },
  "number:135": {
    "file": "numbers-05.mp3",
    "start": 29.823,
    "end": 31.65
  },
  "number:136": {
    "file": "numbers-05.mp3",
    "start": 31.613,
    "end": 33.682
  },
  "number:137": {
    "file": "numbers-05.mp3",
    "start": 33.688,
    "end": 35.51
  },
  "number:138": {
    "file": "numbers-05.mp3",
    "start": 35.52,
    "end": 37.49
  },
  "number:139": {
    "file": "numbers-06.mp3",
    "start": 0,
    "end": 1.703
  },
  "number:140": {
    "file": "numbers-06.mp3",
    "start": 1.653,
    "end": 3.343
  },
  "number:141": {
    "file": "numbers-06.mp3",
    "start": 3.333,
    "end": 5.163
  },
  "number:142": {
    "file": "numbers-06.mp3",
    "start": 5.133,
    "end": 7.063
  },
  "number:143": {
    "file": "numbers-06.mp3",
    "start": 7.093,
    "end": 8.863
  },
  "number:144": {
    "file": "numbers-06.mp3",
    "start": 8.853,
    "end": 10.415
  },
  "number:145": {
    "file": "numbers-06.mp3",
    "start": 10.373,
    "end": 12.623
  },
  "number:146": {
    "file": "numbers-06.mp3",
    "start": 12.6,
    "end": 14.623
  },
  "number:147": {
    "file": "numbers-06.mp3",
    "start": 14.613,
    "end": 16.783
  },
  "number:148": {
    "file": "numbers-06.mp3",
    "start": 16.813,
    "end": 18.743
  },
  "number:149": {
    "file": "numbers-06.mp3",
    "start": 18.693,
    "end": 20.703
  },
  "number:150": {
    "file": "numbers-06.mp3",
    "start": 20.673,
    "end": 22.41
  },
  "number:151": {
    "file": "numbers-06.mp3",
    "start": 22.373,
    "end": 24.303
  },
  "number:152": {
    "file": "numbers-06.mp3",
    "start": 24.293,
    "end": 26.015
  },
  "number:153": {
    "file": "numbers-06.mp3",
    "start": 25.957,
    "end": 27.999
  },
  "number:154": {
    "file": "numbers-06.mp3",
    "start": 27.941,
    "end": 30.143
  },
  "number:155": {
    "file": "numbers-06.mp3",
    "start": 30.133,
    "end": 31.935
  },
  "number:156": {
    "file": "numbers-06.mp3",
    "start": 31.893,
    "end": 33.796
  },
  "number:157": {
    "file": "numbers-06.mp3",
    "start": 33.733,
    "end": 35.711
  },
  "number:158": {
    "file": "numbers-06.mp3",
    "start": 35.669,
    "end": 37.823
  },
  "number:159": {
    "file": "numbers-07.mp3",
    "start": 0,
    "end": 2.09
  },
  "number:160": {
    "file": "numbers-07.mp3",
    "start": 2.048,
    "end": 3.642
  },
  "number:161": {
    "file": "numbers-07.mp3",
    "start": 3.632,
    "end": 5.562
  },
  "number:162": {
    "file": "numbers-07.mp3",
    "start": 5.552,
    "end": 6.842
  },
  "number:163": {
    "file": "numbers-07.mp3",
    "start": 6.752,
    "end": 8.802
  },
  "number:164": {
    "file": "numbers-07.mp3",
    "start": 8.712,
    "end": 11.082
  },
  "number:165": {
    "file": "numbers-07.mp3",
    "start": 10.992,
    "end": 12.453
  },
  "number:166": {
    "file": "numbers-07.mp3",
    "start": 12.432,
    "end": 14.575
  },
  "number:167": {
    "file": "numbers-07.mp3",
    "start": 14.579,
    "end": 16.538
  },
  "number:168": {
    "file": "numbers-07.mp3",
    "start": 16.512,
    "end": 18.602
  },
  "number:169": {
    "file": "numbers-07.mp3",
    "start": 18.632,
    "end": 20.762
  },
  "number:170": {
    "file": "numbers-07.mp3",
    "start": 20.752,
    "end": 22.222
  },
  "number:171": {
    "file": "numbers-07.mp3",
    "start": 22.192,
    "end": 24.142
  },
  "number:172": {
    "file": "numbers-07.mp3",
    "start": 24.152,
    "end": 26.122
  },
  "number:173": {
    "file": "numbers-07.mp3",
    "start": 26.112,
    "end": 28.202
  },
  "number:174": {
    "file": "numbers-07.mp3",
    "start": 28.232,
    "end": 30.362
  },
  "number:175": {
    "file": "numbers-07.mp3",
    "start": 30.632,
    "end": 32.373
  },
  "number:176": {
    "file": "numbers-07.mp3",
    "start": 32.352,
    "end": 34.282
  },
  "number:177": {
    "file": "numbers-07.mp3",
    "start": 34.272,
    "end": 36.554
  },
  "number:178": {
    "file": "numbers-08.mp3",
    "start": 0,
    "end": 1.81
  },
  "number:179": {
    "file": "numbers-08.mp3",
    "start": 1.82,
    "end": 4.063
  },
  "number:180": {
    "file": "numbers-08.mp3",
    "start": 4.08,
    "end": 5.47
  },
  "number:181": {
    "file": "numbers-08.mp3",
    "start": 5.44,
    "end": 7.37
  },
  "number:182": {
    "file": "numbers-08.mp3",
    "start": 7.28,
    "end": 9.07
  },
  "number:183": {
    "file": "numbers-08.mp3",
    "start": 9.04,
    "end": 11.09
  },
  "number:184": {
    "file": "numbers-08.mp3",
    "start": 11.04,
    "end": 13.274
  },
  "number:185": {
    "file": "numbers-08.mp3",
    "start": 13.296,
    "end": 15.256
  },
  "number:186": {
    "file": "numbers-08.mp3",
    "start": 15.234,
    "end": 17.143
  },
  "number:187": {
    "file": "numbers-08.mp3",
    "start": 17.147,
    "end": 19.21
  },
  "number:188": {
    "file": "numbers-08.mp3",
    "start": 19.2,
    "end": 21.35
  },
  "number:189": {
    "file": "numbers-08.mp3",
    "start": 21.4,
    "end": 23.41
  },
  "number:190": {
    "file": "numbers-08.mp3",
    "start": 23.44,
    "end": 24.97
  },
  "number:191": {
    "file": "numbers-08.mp3",
    "start": 24.94,
    "end": 26.917
  },
  "number:192": {
    "file": "numbers-08.mp3",
    "start": 26.88,
    "end": 28.89
  },
  "number:193": {
    "file": "numbers-08.mp3",
    "start": 28.88,
    "end": 30.77
  },
  "number:194": {
    "file": "numbers-08.mp3",
    "start": 30.72,
    "end": 33.018
  },
  "number:195": {
    "file": "numbers-08.mp3",
    "start": 33.072,
    "end": 34.856
  },
  "number:196": {
    "file": "numbers-08.mp3",
    "start": 34.834,
    "end": 36.783
  },
  "number:197": {
    "file": "numbers-09.mp3",
    "start": 0,
    "end": 1.967
  },
  "number:198": {
    "file": "numbers-09.mp3",
    "start": 1.941,
    "end": 3.863
  },
  "number:199": {
    "file": "numbers-09.mp3",
    "start": 3.813,
    "end": 6.116
  },
  "number:200": {
    "file": "numbers-09.mp3",
    "start": 6.053,
    "end": 7.423
  },
  "word:ABEJA": {
    "file": "words-01.mp3",
    "start": 0,
    "end": 0.625
  },
  "word:ARBOL": {
    "file": "words-01.mp3",
    "start": 0.855,
    "end": 1.665
  },
  "word:AVE": {
    "file": "words-01.mp3",
    "start": 1.775,
    "end": 2.465
  },
  "word:AVION": {
    "file": "words-01.mp3",
    "start": 2.588,
    "end": 3.345
  },
  "word:BANANA": {
    "file": "words-01.mp3",
    "start": 3.392,
    "end": 4.305
  },
  "word:BARCO": {
    "file": "words-01.mp3",
    "start": 4.415,
    "end": 5.265
  },
  "word:BESO": {
    "file": "words-01.mp3",
    "start": 5.395,
    "end": 6.225
  },
  "word:BICI": {
    "file": "words-01.mp3",
    "start": 6.455,
    "end": 7.265
  },
  "word:BOTA": {
    "file": "words-01.mp3",
    "start": 7.415,
    "end": 8.145
  },
  "word:BUS": {
    "file": "words-01.mp3",
    "start": 8.295,
    "end": 9.105
  },
  "word:CABALLO": {
    "file": "words-01.mp3",
    "start": 9.155,
    "end": 9.985
  },
  "word:CAMA": {
    "file": "words-01.mp3",
    "start": 10.175,
    "end": 10.865
  },
  "word:CAMELLO": {
    "file": "words-01.mp3",
    "start": 10.955,
    "end": 11.985
  },
  "word:CAMION": {
    "file": "words-01.mp3",
    "start": 12.055,
    "end": 12.945
  },
  "word:CAMISA": {
    "file": "words-01.mp3",
    "start": 13.035,
    "end": 14.065
  },
  "word:CAMPANA": {
    "file": "words-01.mp3",
    "start": 14.155,
    "end": 15.185
  },
  "word:CANGURO": {
    "file": "words-01.mp3",
    "start": 15.335,
    "end": 16.305
  },
  "word:CARACOL": {
    "file": "words-01.mp3",
    "start": 16.355,
    "end": 17.345
  },
  "word:CASA": {
    "file": "words-01.mp3",
    "start": 17.447,
    "end": 18.305
  },
  "word:CERDO": {
    "file": "words-01.mp3",
    "start": 18.415,
    "end": 19.345
  },
  "word:COCHE": {
    "file": "words-01.mp3",
    "start": 19.468,
    "end": 20.305
  },
  "word:COL": {
    "file": "words-01.mp3",
    "start": 20.455,
    "end": 21.265
  },
  "word:CONEJO": {
    "file": "words-01.mp3",
    "start": 21.351,
    "end": 22.385
  },
  "word:CUNA": {
    "file": "words-01.mp3",
    "start": 22.575,
    "end": 23.345
  },
  "word:ESPEJO": {
    "file": "words-01.mp3",
    "start": 23.495,
    "end": 24.465
  },
  "word:ESTRELLA": {
    "file": "words-01.mp3",
    "start": 24.555,
    "end": 25.665
  },
  "word:FLAN": {
    "file": "words-01.mp3",
    "start": 25.815,
    "end": 26.705
  },
  "word:FLOR": {
    "file": "words-01.mp3",
    "start": 26.823,
    "end": 27.745
  },
  "word:FRESA": {
    "file": "words-01.mp3",
    "start": 27.895,
    "end": 28.785
  },
  "word:FUEGO": {
    "file": "words-01.mp3",
    "start": 28.915,
    "end": 29.825
  },
  "word:GALLINA": {
    "file": "words-01.mp3",
    "start": 29.879,
    "end": 30.945
  },
  "word:GATO": {
    "file": "words-01.mp3",
    "start": 31.135,
    "end": 31.905
  },
  "word:GIRASOL": {
    "file": "words-01.mp3",
    "start": 31.975,
    "end": 33.105
  },
  "word:HOJA": {
    "file": "words-01.mp3",
    "start": 33.282,
    "end": 34.145
  },
  "word:HUEVO": {
    "file": "words-01.mp3",
    "start": 34.335,
    "end": 35.185
  },
  "word:ISLA": {
    "file": "words-01.mp3",
    "start": 35.362,
    "end": 36.145
  },
  "word:KOALA": {
    "file": "words-01.mp3",
    "start": 36.295,
    "end": 37.265
  },
  "word:LANA": {
    "file": "words-02.mp3",
    "start": 0,
    "end": 0.77
  },
  "word:LAPIZ": {
    "file": "words-02.mp3",
    "start": 0.973,
    "end": 1.97
  },
  "word:LECHE": {
    "file": "words-02.mp3",
    "start": 2.147,
    "end": 3.09
  },
  "word:LEON": {
    "file": "words-02.mp3",
    "start": 3.24,
    "end": 4.37
  },
  "word:LIBRO": {
    "file": "words-02.mp3",
    "start": 4.413,
    "end": 5.17
  },
  "word:LLAVE": {
    "file": "words-02.mp3",
    "start": 5.347,
    "end": 6.29
  },
  "word:LUNA": {
    "file": "words-02.mp3",
    "start": 6.56,
    "end": 7.65
  },
  "word:MALETA": {
    "file": "words-02.mp3",
    "start": 7.693,
    "end": 8.53
  },
  "word:MANO": {
    "file": "words-02.mp3",
    "start": 8.632,
    "end": 9.49
  },
  "word:MANZANA": {
    "file": "words-02.mp3",
    "start": 9.58,
    "end": 10.93
  },
  "word:MAR": {
    "file": "words-02.mp3",
    "start": 11.02,
    "end": 11.65
  },
  "word:MONO": {
    "file": "words-02.mp3",
    "start": 11.784,
    "end": 12.77
  },
  "word:NARANJA": {
    "file": "words-02.mp3",
    "start": 12.96,
    "end": 13.97
  },
  "word:NIEVE": {
    "file": "words-02.mp3",
    "start": 14.06,
    "end": 14.93
  },
  "word:NUBE": {
    "file": "words-02.mp3",
    "start": 15.16,
    "end": 15.97
  },
  "word:OSO": {
    "file": "words-02.mp3",
    "start": 16.32,
    "end": 17.01
  },
  "word:OVEJA": {
    "file": "words-02.mp3",
    "start": 17.24,
    "end": 18.05
  },
  "word:PALOMA": {
    "file": "words-02.mp3",
    "start": 18.14,
    "end": 19.17
  },
  "word:PAN": {
    "file": "words-02.mp3",
    "start": 19.3,
    "end": 20.05
  },
  "word:PANDA": {
    "file": "words-02.mp3",
    "start": 20.133,
    "end": 21.09
  },
  "word:PATO": {
    "file": "words-02.mp3",
    "start": 21.18,
    "end": 21.97
  },
  "word:PELOTA": {
    "file": "words-02.mp3",
    "start": 22.06,
    "end": 23.09
  },
  "word:PERA": {
    "file": "words-02.mp3",
    "start": 23.2,
    "end": 24.05
  },
  "word:PERRO": {
    "file": "words-02.mp3",
    "start": 24.16,
    "end": 25.09
  },
  "word:PEZ": {
    "file": "words-02.mp3",
    "start": 25.213,
    "end": 25.97
  },
  "word:POLLO": {
    "file": "words-02.mp3",
    "start": 26.08,
    "end": 26.93
  },
  "word:PRINCESA": {
    "file": "words-02.mp3",
    "start": 26.98,
    "end": 28.21
  },
  "word:QUESO": {
    "file": "words-02.mp3",
    "start": 28.36,
    "end": 29.65
  },
  "word:RANA": {
    "file": "words-02.mp3",
    "start": 29.76,
    "end": 30.45
  },
  "word:RATON": {
    "file": "words-02.mp3",
    "start": 30.56,
    "end": 31.57
  },
  "word:RELOJ": {
    "file": "words-02.mp3",
    "start": 31.72,
    "end": 32.93
  },
  "word:ROJA": {
    "file": "words-02.mp3",
    "start": 33.053,
    "end": 33.81
  },
  "word:SEMILLA": {
    "file": "words-02.mp3",
    "start": 33.92,
    "end": 35.01
  },
  "word:SILLA": {
    "file": "words-02.mp3",
    "start": 35.24,
    "end": 36.45
  },
  "word:SOL": {
    "file": "words-02.mp3",
    "start": 36.56,
    "end": 37.25
  },
  "word:SOMBRERO": {
    "file": "words-03.mp3",
    "start": 0,
    "end": 1.09
  },
  "word:SONRISA": {
    "file": "words-03.mp3",
    "start": 1.2,
    "end": 2.69
  },
  "word:SOPA": {
    "file": "words-03.mp3",
    "start": 2.8,
    "end": 3.49
  },
  "word:TAZA": {
    "file": "words-03.mp3",
    "start": 3.68,
    "end": 4.45
  },
  "word:TIGRE": {
    "file": "words-03.mp3",
    "start": 4.64,
    "end": 5.49
  },
  "word:TOMATE": {
    "file": "words-03.mp3",
    "start": 5.58,
    "end": 6.61
  },
  "word:TORTUGA": {
    "file": "words-03.mp3",
    "start": 6.68,
    "end": 7.73
  },
  "word:TREN": {
    "file": "words-03.mp3",
    "start": 7.832,
    "end": 8.69
  },
  "word:UVA": {
    "file": "words-03.mp3",
    "start": 8.96,
    "end": 9.97
  },
  "word:VACA": {
    "file": "words-03.mp3",
    "start": 10.02,
    "end": 10.69
  },
  "word:VENTANA": {
    "file": "words-03.mp3",
    "start": 10.75,
    "end": 11.89
  },
  "word:ZAPATO": {
    "file": "words-03.mp3",
    "start": 12,
    "end": 13.09
  },
  "word:ZORRO": {
    "file": "words-03.mp3",
    "start": 13.32,
    "end": 14.37
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
    "file": "pedagogy-01.mp3",
    "start": 0,
    "end": 21.905
  },
  "text:tenemos nueve unidades ahora llega una pieza mas nueve mas una son diez acabamos de pasar del nueve al diez": {
    "file": "pedagogy-01.mp3",
    "start": 21.955,
    "end": 32.945
  },
  "text:como diez piezas sueltas son muchas las guardamos juntas en una caja dentro hay exactamente diez unidades a este grupo completo lo llamamos una decena una decena vale lo mismo que diez unidades": {
    "file": "pedagogy-02.mp3",
    "start": 0,
    "end": 16.41
  },
  "text:la caja de la decena ya esta completa ahora aparece una unidad nueva y se queda fuera tenemos una decena que vale diez y una unidad mas diez mas uno son once": {
    "file": "pedagogy-02.mp3",
    "start": 16.613,
    "end": 32.09
  },
  "text:seguimos despacio una decena y una unidad son once con otra unidad llegamos a doce despues trece y con cuatro unidades sueltas llegamos a catorce la decena sigue completa solo aumentan las unidades de fuera": {
    "file": "pedagogy-03.mp3",
    "start": 0,
    "end": 19.15
  },
  "text:ya podemos mirar el catorce de otra forma el uno nos recuerda que hay una decena completa el cuatro nos dice que hay cuatro unidades sueltas por eso catorce es igual a diez mas cuatro ahora si vamos a practicar": {
    "file": "pedagogy-04.mp3",
    "start": 0,
    "end": 18.823
  },
  "text:construye una decena vamos a descubrir poco a poco como diez unidades forman una decena y como nacen los numeros mayores de 10 ejemplo 14 es igual a 10 + 4": {
    "file": "pedagogy-04.mp3",
    "start": 18.807,
    "end": 35.023
  },
  "text:aterriza en el 10 antes de seguir restando busca cuanto hay que quitar para llegar exactamente a 10 desde 16 quitamos 6 y aterrizamos en 10 ejemplo 16 menos 6 es igual a 10": {
    "file": "pedagogy-05.mp3",
    "start": 0,
    "end": 20.37
  },
  "text:cruza el puente del 10 si hay que quitar mas divide la resta en dos saltos en 14 menos 6 primero quita 4 para llegar a 10 y despues quita los 2 que faltan ejemplo 14 menos 6 es igual a 14 menos 4 menos 2 es igual a 8": {
    "file": "pedagogy-06.mp3",
    "start": 0,
    "end": 29.21
  },
  "text:resuelve historias ahora usa el puente del 10 en pequenas aventuras imagina los objetos quita los que se marchan y comprueba cuantos quedan ejemplo 15 luciernagas menos 7 que se van es igual a 8": {
    "file": "pedagogy-07.mp3",
    "start": 0,
    "end": 20.43
  },
  "text:mision final demuestra lo aprendido con seis restas para superar la mision necesitas acertar al menos la mitad puedes repetirla cuando quieras ejemplo piensa llegar a 10 y continuar": {
    "file": "pedagogy-07.mp3",
    "start": 20.66,
    "end": 37.95
  },
  "text:el 17 tiene una decena cuantas unidades sueltas tiene": {
    "file": "pedagogy-08.mp3",
    "start": 0,
    "end": 5.103
  },
  "text:el 12 tiene una decena cuantas unidades sueltas tiene": {
    "file": "pedagogy-08.mp3",
    "start": 5.28,
    "end": 10.063
  },
  "text:el 14 tiene una decena cuantas unidades sueltas tiene": {
    "file": "pedagogy-08.mp3",
    "start": 10.213,
    "end": 15.183
  },
  "text:el 19 tiene una decena cuantas unidades sueltas tiene": {
    "file": "pedagogy-08.mp3",
    "start": 15.36,
    "end": 20.783
  },
  "text:cuanto debes quitar a 18 para llegar a 10": {
    "file": "pedagogy-08.mp3",
    "start": 20.893,
    "end": 24.063
  },
  "text:cuanto debes quitar a 15 para llegar a 10": {
    "file": "pedagogy-08.mp3",
    "start": 24.333,
    "end": 27.343
  },
  "text:cuanto debes quitar a 16 para llegar a 10": {
    "file": "pedagogy-08.mp3",
    "start": 27.573,
    "end": 30.783
  },
  "text:cuanto debes quitar a 13 para llegar a 10": {
    "file": "pedagogy-08.mp3",
    "start": 31.013,
    "end": 33.903
  },
  "text:catorce menos seis primero quita 4 y despues 2 cuanto queda": {
    "file": "pedagogy-09.mp3",
    "start": 0,
    "end": 7.49
  },
  "text:quince menos siete primero quita 5 y despues 2 cuanto queda": {
    "file": "pedagogy-09.mp3",
    "start": 7.773,
    "end": 15.41
  },
  "text:dieciseis menos nueve primero quita 6 y despues 3 cuanto queda": {
    "file": "pedagogy-09.mp3",
    "start": 15.62,
    "end": 23.73
  },
  "text:trece menos cinco primero quita 3 y despues 2 cuanto queda": {
    "file": "pedagogy-09.mp3",
    "start": 23.96,
    "end": 31.81
  },
  "text:habia 13 galletas compartes 5 cuantas quedan": {
    "file": "pedagogy-09.mp3",
    "start": 32.02,
    "end": 37.41
  },
  "text:habia 16 peces se esconden 7 cuantos puedes ver": {
    "file": "pedagogy-10.mp3",
    "start": 0,
    "end": 5.73
  },
  "text:habia 15 luciernagas se fueron 7 cuantas quedan": {
    "file": "pedagogy-10.mp3",
    "start": 5.94,
    "end": 11.65
  },
  "text:habia 18 cohetes despegan 9 cuantos quedan": {
    "file": "pedagogy-10.mp3",
    "start": 11.88,
    "end": 17.57
  },
  "text:cuanto es doce menos cinco": {
    "file": "pedagogy-10.mp3",
    "start": 18,
    "end": 20.29
  },
  "text:cuanto es catorce menos ocho": {
    "file": "pedagogy-10.mp3",
    "start": 20.6,
    "end": 22.85
  },
  "text:cuanto es dieciocho menos nueve": {
    "file": "pedagogy-10.mp3",
    "start": 23.2,
    "end": 25.81
  },
  "text:cuanto es dieciseis menos seis": {
    "file": "pedagogy-10.mp3",
    "start": 26.08,
    "end": 28.77
  },
  "text:cuanto es diecinueve menos siete": {
    "file": "pedagogy-10.mp3",
    "start": 29.04,
    "end": 31.73
  },
  "text:cuanto es diecisiete menos nueve": {
    "file": "pedagogy-10.mp3",
    "start": 32.04,
    "end": 34.77
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

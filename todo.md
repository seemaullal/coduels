### Core Features ###
 - Log in   
 - Screen cast of what you can do (demo) for about page   
 - Live feed of open "battles" (___  & ___ are battling on ___ challenge).
 - Panel?  Github sign in, Google plus, twitter, other ??  
 - Profile page 
 - Random challenge plus challenge specific user
 - Can pick any challenge (grouped by easy, medium, hard)
 - Leader board on challenge page of "top scores" (?) from users who have done the challenge
 - Let users comment/rate other peoples code (maybe)
 

###Added Features ###
 - Pause challenge
 - Add circles/groups of people (can challenge people in your groups)
 
####Additional stuff from 3/18 Office Hours ####
 - Runner iframe- reporting data to server
 - Room setup 
 - Code editor on change
 - Use Firebase for chat, room setup
 
 #### Models ####
 - User:
    -completed exercises: [ exercise refs ]
   -challenge [ ref to challenges ]
   - (+ generator user schema)

 - Exercise
   -Description: {long: string, short: lil' string}
   -Editor prompt: string (code?)
   -Input/Output or Test or something (String or object)
 - Categories: [String]
 - Difficulty: String
 - Completed users [ user refs ] 
 
 - (Active?)Challenges
   -Players [User refs ]
   -Exercise: exercise ref

 - Leaderboard/Score
   -User ref


 
 

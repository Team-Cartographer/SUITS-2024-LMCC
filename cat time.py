import time

dancing_cats = [
    [
        r'''
   /\_/\  
  / o o \ 
 (   "   )
  \~(*)~/
''',
        r'''
   /\_/\  
  / o o \ 
 (   "   )
  \~(*)~/
'''
    ],
    [
        r'''
 /\_/\  
( o.o ) 
 > ^ <
''',
        r'''
 /\_/\  
( -.- ) 
 > ^ <
'''
  [
        r'''
   /\_/\  
  / o o \ 
 (   "   )
  \~(*)~/
''',
    ]
]


# Function to clear the screen
def clear_screen():
    print("\033[H\033[J", end='')

# Main loop to display the dancing cat frames
while True:
    for cat_frames in dancing_cats:
        for frame in cat_frames:
            clear_screen()
            print(frame)
            time.sleep(0.5)  # Adjust sleep time to change animation speed

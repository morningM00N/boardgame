import pdb;

import itertools



def getActionSpace(handSize:int=8):
  items =[]
  for i in range(handSize):
      items.append(i)

  actions = []
  for i in range(1,6):
    for c in itertools.combinations(items,i):
      result = ""
      for z in c:
        result = result + str(z)
      actions.append(result)
  return actions

from typing import Optional
import numpy as np
import gymnasium as gym
from gymnasium.wrappers import FlattenObservation
import random


np.random.seed(42)  # 42는 임의의 숫자이며, 다른 숫자를 사용해도 됩니다.
random.seed(42)  # 42는 임의의 숫자이며, 다른 숫자를 사용해도 됩니다.

class StraightEnv(gym.Env):

    def __init__(self, handSize: int = 8, numOfChanges: int=6):
        self.handSize = handSize
        self.numOfChanges=numOfChanges

        self.observation_space = gym.spaces.Dict(
            {
                "DECK": gym.spaces.Box(0, 10, shape=(4,13), dtype=int),
                "HAND": gym.spaces.Box(0, 125, shape=(self.handSize,), dtype=int),
                "CHANGE" : gym.spaces.Box(0, self.numOfChanges, shape=(1,), dtype=int),
                "META": gym.spaces.Box(0, 1, shape=(8,8), dtype=int)
            }
        )
        self.actions = getActionSpace(self.handSize)
        self.action_space = gym.spaces.Discrete(len(self.actions))

    def calcHand(self):
        self.metaInfor = [[0 for _ in range(8)] for _ in range(8)]
        for i in range(len(self.hand)):
          for j in range(i+1,len(self.hand)):
            if self.hand[j-1]//10 == self.hand[j]//10:
              self.metaInfor[i][j]=1
            else:
              break
        return

    def _get_obs(self):
        self.calcHand()
        return {"DECK": self.deck, "HAND": self.hand, "CHANGE": self.remainChanges, "META":self.metaInfor}

    def _get_info(self):
        return {}

    def drawCard(self):
      idx1 = np.random.randint(0,4)
      idx2 = np.random.randint(0,13)
      while self.deck[idx1][idx2] == 0:
        idx1 = np.random.randint(0,4)
        idx2 = np.random.randint(0,13)
      self.deck[idx1][idx2]-=1
      self.hand.append(idx2*10+idx1)

    def fourCardScore(self):
      m = [0]*13
      for i in range(len(self.hand)):
        m[self.hand[i]//10]+=1
      maxScore = 0
      for i in range(len(m)):
        if m[i]>maxScore and (self.deck[3][i]>0 or self.deck[0][i]>0 or self.deck[1][i]>0 or self.deck[2][i]>0):
          maxScore = m[i]
      assert maxScore<4
      return maxScore

    def isFourCards(self):
      m = [0]*13
      for i in range(len(self.hand)):
        idx = self.hand[i]//10
        if idx < len(m):
          m[idx]+=1
      for i in range(len(m)):
        if m[i] >= 4:
          return True
      return False

    def reset(self, seed: Optional[int] = None, options: Optional[dict] = None):
        super().reset(seed=seed)
        self.deck = [[1]*13,[1]*13,[1]*13,[1]*13]
        for i in range(4):
          for j in range(3):
            self.deck[i][j+10]=0
        self.deck[0][0]-=1
        self.deck[1][0]-=1
        self.deck[0][1]+=1
        self.deck[1][1]+=1
        self.remainChanges = self.numOfChanges
        self.hand = []
        for i in range(self.handSize):
          self.drawCard()
        self.hand = sorted(self.hand)
        while self.isFourCards():
          self.deck = [[1]*13,[1]*13,[1]*13,[1]*13]
          for i in range(4):
            for j in range(3):
              self.deck[i][j+10]=0
          self.deck[0][0]-=1
          self.deck[1][0]-=1
          self.deck[0][1]+=1
          self.deck[1][1]+=1
          self.hand = []
          for i in range(self.handSize):
            self.drawCard()
          self.hand = sorted(self.hand)

        observation = self._get_obs()
        info = self._get_info()

        return observation, info

    def step(self, action):
        act = self.actions[action]
        for idx in act:
          self.hand[int(idx)]=100000
        self.hand = sorted(self.hand)
        numOfChangeThisTime = 0
        while self.hand[-1] == 100000:
          numOfChangeThisTime+=1
          self.hand.pop()
        assert numOfChangeThisTime<=5, numOfChangeThisTime

        while len(self.hand)<self.handSize:
          self.drawCard()
        self.hand = sorted(self.hand)
        self.remainChanges-=1

        reward = 0
        terminated = False
        if self.isFourCards():
          reward = 100+(self.remainChanges)*10
          terminated=True
        elif self.remainChanges == 0:
          reward = -50
          terminated=True
        else:
          fourCardScore = self.fourCardScore()
          reward = fourCardScore*self.remainChanges

        observation = self._get_obs()
        info = self._get_info()

        return observation, reward, terminated, False, info

import gymnasium as gym
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
torch.use_deterministic_algorithms(True)
torch.backends.cudnn.deterministic = True
torch.manual_seed(42)

# Hyperparameters
GAMMA = 0.99
LR = 0.001
BATCH_SIZE = 64
MEMORY_SIZE = 10000
EPISODES = 100_000
EPSILON_START = 1.0
EPSILON_END = 0.01
EPSILON_DECAY = 0.995
TARGET_UPDATE = 10

# Q-Network
class QNetwork(nn.Module):
    def __init__(self, state_dim, action_dim):
        super(QNetwork, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(state_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, action_dim)
        )

    def forward(self, x):
        return self.fc(x)

# Replay Buffer
class ReplayBuffer:
    def __init__(self, size):
        self.buffer = deque(maxlen=size)

    def add(self, transition):
        self.buffer.append(transition)

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        return (np.array(states), np.array(actions), np.array(rewards),
                np.array(next_states), np.array(dones))

    def __len__(self):
        return len(self.buffer)

# Epsilon-greedy action selection
def select_action(state, policy_net, epsilon, action_dim):
    if random.random() < epsilon:
        return random.randint(0, action_dim - 1)
    state = torch.FloatTensor(state).unsqueeze(0)
    with torch.no_grad():
        return policy_net(state).argmax().item()

# Training function
def optimize_model(policy_net, target_net, optimizer, replay_buffer):
    if len(replay_buffer) < BATCH_SIZE:
        return

    states, actions, rewards, next_states, dones = replay_buffer.sample(BATCH_SIZE)

    states = torch.FloatTensor(states)
    actions = torch.LongTensor(actions)
    rewards = torch.FloatTensor(rewards)
    next_states = torch.FloatTensor(next_states)
    dones = torch.FloatTensor(dones)

    q_values = policy_net(states).gather(1, actions.unsqueeze(1)).squeeze(1)
    next_q_values = target_net(next_states).max(1)[0]
    target_q_values = rewards + GAMMA * next_q_values * (1 - dones)

    loss = nn.MSELoss()(q_values, target_q_values.detach())
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

# Main function
stratighEnv = StraightEnv()
env = wrapped_env = FlattenObservation(stratighEnv)

state_dim = env.observation_space.shape[0]
action_dim = env.action_space.n

policy_net = QNetwork(state_dim, action_dim)
target_net = QNetwork(state_dim, action_dim)
target_net.load_state_dict(policy_net.state_dict())
target_net.eval()

optimizer = optim.Adam(policy_net.parameters(), lr=LR)
replay_buffer = ReplayBuffer(MEMORY_SIZE)

epsilon = EPSILON_START
numOfSucceeded = 0
prevnumOfSucceeded = 0
maxSucceded = 0
for episode in range(EPISODES):
    seed = random.randint(0, 100000)
    state, _ = env.reset(seed=seed)
    total_reward = 0

    while True:
        action = select_action(state, policy_net, epsilon, action_dim)
        next_state, reward, done, _, _ = env.step(action)
        if reward >= 100:
          assert done == True
          numOfSucceeded+=1

        replay_buffer.add((state, action, reward, next_state, done))
        state = next_state
        total_reward += reward

        optimize_model(policy_net, target_net, optimizer, replay_buffer)

        if done:
            break

    epsilon = max(EPSILON_END, epsilon * EPSILON_DECAY)

    if episode % TARGET_UPDATE == 0:
        target_net.load_state_dict(policy_net.state_dict())
    if episode % 100==0 or (episode > 1000 and maxSucceded < round(100*numOfSucceeded/(episode+1))):
      if episode > 1000:
        if maxSucceded == round(100*numOfSucceeded/(episode+1)) and episode%1000!=0:
          continue
        maxSucceded = max(maxSucceded,round(100*numOfSucceeded/(episode+1)))
      prevnumOfSucceeded = round(100*numOfSucceeded/(episode+1))
      print(f"Episode {episode}\t Cur Succeded Ratio: {prevnumOfSucceeded}%\t Max Succeded Ratio: {maxSucceded}%")

env.close()


input()

numOfSucceded = 0
numOfIter = 100000
for i in range(numOfIter):
  strEvn = StraightEnv()
  env,inf = strEvn.reset()
  while True:
    act = strEvn.action_space.sample()
    observation, reward, terminated, _, _ = strEvn.step(act)
    if terminated:
      if reward > 0:
        numOfSucceded+=1
      break
  print(f"{i}\tratio:{numOfSucceded/(i+1):.2}")

#abandon deck / four card

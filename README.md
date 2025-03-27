# SoundTrek
A decentralized app for creating audio diaries and location-based soundscapes on the Stacks blockchain.

## Features
- Create audio diary entries with location data
- Listen to soundscapes at specific locations
- Manage audio entry ownership and permissions
- Trade/transfer audio entries as NFTs

## Setup and Installation
1. Clone the repository
2. Install Clarinet (if not already installed)
3. Run `clarinet check` to verify the contract
4. Run `clarinet test` to run the test suite

## Usage Examples
```clarity
;; Create a new audio entry
(contract-call? .soundtrek create-audio-entry "My Audio Diary" 
  u"audio-hash" 
  {latitude: 40.7128, longitude: -74.0060}
)

;; Get audio entry at location
(contract-call? .soundtrek get-audio-at-location 
  {latitude: 40.7128, longitude: -74.0060}
)

;; Transfer audio entry ownership
(contract-call? .soundtrek transfer-entry 
  u1 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment

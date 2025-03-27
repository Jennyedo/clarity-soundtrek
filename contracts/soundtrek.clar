;; SoundTrek - Audio diary and location-based soundscapes

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-found (err u404))
(define-constant err-unauthorized (err u401))
(define-constant err-invalid-location (err u400))

;; Define audio entry type
(define-non-fungible-token audio-entry uint)

;; Data structures
(define-map audio-entries uint {
  title: (string-ascii 100),
  audio-hash: (string-ascii 64),
  creator: principal,
  latitude: int,
  longitude: int,
  created-at: uint
})

(define-map location-index {latitude: int, longitude: int} (list 10 uint))

;; Data vars
(define-data-var entry-counter uint u0)

;; Public functions
(define-public (create-audio-entry (title (string-ascii 100)) 
                                 (audio-hash (string-ascii 64))
                                 (location {latitude: int, longitude: int}))
  (let ((entry-id (+ (var-get entry-counter) u1))
        (current-time (get-block-info? time (- block-height u1))))
    (try! (nft-mint? audio-entry entry-id tx-sender))
    (map-set audio-entries entry-id {
      title: title,
      audio-hash: audio-hash,
      creator: tx-sender,
      latitude: (get latitude location),
      longitude: (get longitude location),
      created-at: (default-to u0 current-time)
    })
    (map-set location-index location 
      (append (default-to (list) (map-get? location-index location)) entry-id))
    (var-set entry-counter entry-id)
    (ok entry-id)))

(define-public (transfer-entry (entry-id uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (nft-get-owner? audio-entry entry-id))
      err-unauthorized)
    (try! (nft-transfer? audio-entry entry-id tx-sender recipient))
    (ok true)))

;; Read only functions
(define-read-only (get-audio-entry (entry-id uint))
  (ok (map-get? audio-entries entry-id)))

(define-read-only (get-audio-at-location (location {latitude: int, longitude: int}))
  (ok (map-get? location-index location)))

(define-read-only (get-entry-owner (entry-id uint))
  (ok (nft-get-owner? audio-entry entry-id)))

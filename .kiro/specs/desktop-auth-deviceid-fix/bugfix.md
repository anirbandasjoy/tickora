# Bugfix Requirements Document

## Introduction

The desktop authentication flow successfully creates sessions and registers devices in the `desktopdevice` collection, but fails to populate the `deviceId` field in the `desktopdevice` collection (DesktopAuthRequest documents). This causes downstream issues where the `/api/v1/desktop/auth/me` endpoint returns 404 errors and prevents proper display of profile cards and logout functionality for logged-in desktop users.

The bug occurs during the code exchange step of the device flow authentication, where a device is registered and a session is created, but the corresponding auth request document's `deviceId` field remains null instead of being updated with the newly created device's ID.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a desktop app completes the device flow authentication and exchanges the authorization code THEN the system creates a device and session but leaves the `deviceId` field null in the DesktopAuthRequest document

1.2 WHEN the DesktopAuthRequest document has a null `deviceId` after successful authentication THEN the system cannot properly track which device was registered for that auth request

1.3 WHEN desktop clients make authenticated requests with a valid session token THEN the `/api/v1/desktop/auth/me` endpoint returns 404 instead of the user profile data

### Expected Behavior (Correct)

2.1 WHEN a desktop app completes the device flow authentication and exchanges the authorization code THEN the system SHALL update the DesktopAuthRequest document's `deviceId` field with the ID of the newly registered device

2.2 WHEN the DesktopAuthRequest document is consumed during code exchange THEN the system SHALL persist the association between the auth request and the registered device by setting the `deviceId` field

2.3 WHEN desktop clients make authenticated requests with a valid session token THEN the `/api/v1/desktop/auth/me` endpoint SHALL return the user profile data successfully

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a desktop auth request is created THEN the system SHALL CONTINUE TO initialize the `deviceId` field as null

3.2 WHEN a desktop auth request is approved by the user THEN the system SHALL CONTINUE TO set the `userId` and `codeHash` fields without modifying `deviceId`

3.3 WHEN a device is registered during code exchange THEN the system SHALL CONTINUE TO create the device document and session with the correct `deviceId`

3.4 WHEN the `requireDesktopAuth` middleware authenticates a request THEN the system SHALL CONTINUE TO populate `req.desktop` with userId, deviceId, and sessionId from the session

3.5 WHEN listing, refreshing, or revoking desktop sessions THEN the system SHALL CONTINUE TO function correctly with the session's deviceId

3.6 WHEN the auth request status is checked, cancelled, or expires THEN the system SHALL CONTINUE TO function as currently implemented

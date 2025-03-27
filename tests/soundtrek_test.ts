import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Test creating new audio entry",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('soundtrek', 'create-audio-entry', [
        types.ascii("Test Audio"),
        types.ascii("QmTest123"),
        types.tuple({
          'latitude': types.int(407128),
          'longitude': types.int(-740060)
        })
      ], deployer.address)
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
    
    const entry = chain.callReadOnlyFn(
      'soundtrek',
      'get-audio-entry',
      [types.uint(1)],
      deployer.address
    );
    
    entry.result.expectOk().expectSome();
  },
});

Clarinet.test({
  name: "Test audio entry transfer",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Create entry first
    let block = chain.mineBlock([
      Tx.contractCall('soundtrek', 'create-audio-entry', [
        types.ascii("Test Audio"),
        types.ascii("QmTest123"),
        types.tuple({
          'latitude': types.int(407128),
          'longitude': types.int(-740060)
        })
      ], deployer.address)
    ]);
    
    // Transfer entry
    block = chain.mineBlock([
      Tx.contractCall('soundtrek', 'transfer-entry', [
        types.uint(1),
        types.principal(wallet1.address)
      ], deployer.address)
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Verify new owner
    const owner = chain.callReadOnlyFn(
      'soundtrek',
      'get-entry-owner',
      [types.uint(1)],
      deployer.address
    );
    
    owner.result.expectOk().expectSome().expectPrincipal(wallet1.address);
  },
});

Clarinet.test({
  name: "Test get audio at location",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    // Create entry
    let block = chain.mineBlock([
      Tx.contractCall('soundtrek', 'create-audio-entry', [
        types.ascii("Test Audio"),
        types.ascii("QmTest123"),
        types.tuple({
          'latitude': types.int(407128),
          'longitude': types.int(-740060)
        })
      ], deployer.address)
    ]);
    
    // Get entries at location
    const entries = chain.callReadOnlyFn(
      'soundtrek',
      'get-audio-at-location',
      [types.tuple({
        'latitude': types.int(407128),
        'longitude': types.int(-740060)
      })],
      deployer.address
    );
    
    entries.result.expectOk().expectSome();
  },
});

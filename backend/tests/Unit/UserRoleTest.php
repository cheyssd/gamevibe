<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_user_avec_role_admin_est_reconnu_admin(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $this->assertEquals('admin', $user->role);
        $this->assertTrue($user->role === 'admin');
    }

    public function test_un_user_avec_role_user_n_est_pas_admin(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->assertEquals('user', $user->role);
        $this->assertFalse($user->role === 'admin');
    }

    public function test_le_role_par_defaut_est_user(): void
    {
        $user = User::factory()->create();

        $this->assertEquals('user', $user->role);
    }
}
